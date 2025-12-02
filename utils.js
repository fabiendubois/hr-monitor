(function (exports) {

    function calculatePowerZone(power, userFtp) {
        if (!userFtp) return { name: 'ZONE --', class: '' };

        const pct = (power / userFtp) * 100;

        if (pct < 55) return { name: 'ZONE 1 - RÉCUPÉRATION', class: 'zone-z1' };
        if (pct < 76) return { name: 'ZONE 2 - ENDURANCE', class: 'zone-z2' };
        if (pct < 91) return { name: 'ZONE 3 - TEMPO', class: 'zone-z3' };
        if (pct < 106) return { name: 'ZONE 4 - SEUIL', class: 'zone-z4' };
        if (pct < 121) return { name: 'ZONE 5 - VO2 MAX', class: 'zone-z5' };
        if (pct < 151) return { name: 'ZONE 6 - ANAÉROBIE', class: 'zone-z6' };
        return { name: 'ZONE 7 - SPRINT', class: 'zone-z7' };
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function generateTCX(data) {
        if (!data || data.length === 0) return '';

        const startTimeStr = data[0].time.toISOString();
        const totalTimeSeconds = data[data.length - 1].elapsed;

        let trackpoints = '';
        data.forEach(point => {
            // Convert speed from km/h to m/s for TCX format
            const speedMS = (point.speed * 1000) / 3600;

            trackpoints += `
            <Trackpoint>
                <Time>${point.time.toISOString()}</Time>
                <HeartRateBpm>
                    <Value>${point.hr}</Value>
                </HeartRateBpm>
                <Cadence>${point.cadence}</Cadence>
                <Extensions>
                    <TPX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
                        <Speed>${speedMS.toFixed(3)}</Speed>
                        <Watts>${point.power}</Watts>
                    </TPX>
                </Extensions>
            </Trackpoint>`;
        });

        return `<?xml version="1.0" encoding="UTF-8"?>
    <TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
        <Activities>
            <Activity Sport="Biking">
                <Id>${startTimeStr}</Id>
                <Lap StartTime="${startTimeStr}">
                    <TotalTimeSeconds>${totalTimeSeconds}</TotalTimeSeconds>
                    <Intensity>Active</Intensity>
                    <TriggerMethod>Manual</TriggerMethod>
                    <Track>
                        ${trackpoints}
                    </Track>
                </Lap>
                <Creator>
                    <Name>HR Monitor Pro - Indoor Trainer</Name>
                </Creator>
                <Notes>Indoor Trainer Session</Notes>
            </Activity>
        </Activities>
    </TrainingCenterDatabase>`;
    }

    function parseZWO(xmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

        const workoutNode = xmlDoc.querySelector("workout_file");
        if (!workoutNode) {
            throw new Error("Invalid ZWO file: missing workout_file tag");
        }

        const name = xmlDoc.querySelector("name")?.textContent || "Imported Workout";
        const description = xmlDoc.querySelector("description")?.textContent || "Imported from ZWO";
        const author = xmlDoc.querySelector("author")?.textContent || "";

        const steps = [];
        const workoutData = xmlDoc.querySelector("workout");

        if (workoutData) {
            for (const child of workoutData.children) {
                const duration = parseInt(child.getAttribute("Duration")) || 0;

                // Common attributes
                const power = parseFloat(child.getAttribute("Power")) || 0;
                const powerLow = parseFloat(child.getAttribute("PowerLow"));
                const powerHigh = parseFloat(child.getAttribute("PowerHigh"));
                const cadence = parseInt(child.getAttribute("Cadence")) || null;

                switch (child.tagName) {
                    case "SteadyState":
                        steps.push({
                            type: "steady",
                            duration: duration,
                            power: power,
                            label: "Steady State",
                            cadence: cadence
                        });
                        break;

                    case "Warmup":
                        steps.push({
                            type: "warmup",
                            duration: duration,
                            power: powerLow !== null && !isNaN(powerLow) ? powerLow : 0.25,
                            powerEnd: powerHigh !== null && !isNaN(powerHigh) ? powerHigh : 0.75, // Store end power for ramps
                            label: "Warmup",
                            cadence: cadence
                        });
                        break;

                    case "CoolDown":
                        steps.push({
                            type: "cooldown",
                            duration: duration,
                            power: powerLow !== null && !isNaN(powerLow) ? powerLow : 0.75,
                            powerEnd: powerHigh !== null && !isNaN(powerHigh) ? powerHigh : 0.25,
                            label: "Cool Down",
                            cadence: cadence
                        });
                        break;

                    case "Ramp":
                        steps.push({
                            type: "ramp",
                            duration: duration,
                            power: powerLow !== null && !isNaN(powerLow) ? powerLow : 0.25,
                            powerEnd: powerHigh !== null && !isNaN(powerHigh) ? powerHigh : 0.75,
                            label: "Ramp",
                            cadence: cadence
                        });
                        break;

                    case "FreeRide":
                         steps.push({
                            type: "freeride",
                            duration: duration,
                            power: 0, // 0 usually means "free" or flat
                            label: "Free Ride",
                            cadence: cadence
                        });
                        break;

                    case "IntervalsT":
                        const repeat = parseInt(child.getAttribute("Repeat")) || 1;
                        const onDuration = parseInt(child.getAttribute("OnDuration")) || 0;
                        const offDuration = parseInt(child.getAttribute("OffDuration")) || 0;
                        const onPower = parseFloat(child.getAttribute("OnPower")) || 0;
                        const offPower = parseFloat(child.getAttribute("OffPower")) || 0;

                        for (let i = 0; i < repeat; i++) {
                            steps.push({
                                type: "interval",
                                duration: onDuration,
                                power: onPower,
                                label: `Interval ${i+1}/${repeat}`,
                                cadence: cadence // Usually cadence is for the ON part
                            });
                            steps.push({
                                type: "recovery",
                                duration: offDuration,
                                power: offPower,
                                label: `Recovery ${i+1}/${repeat}`
                            });
                        }
                        break;
                }
            }
        }

        return {
            id: "zwo_" + Date.now(),
            name: name,
            description: description,
            author: author,
            steps: steps
        };
    }

    exports.calculatePowerZone = calculatePowerZone;
    exports.formatTime = formatTime;
    exports.generateTCX = generateTCX;
    exports.parseZWO = parseZWO;

})(typeof exports === 'undefined' ? window : exports);
