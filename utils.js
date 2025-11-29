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

    exports.calculatePowerZone = calculatePowerZone;
    exports.formatTime = formatTime;
    exports.generateTCX = generateTCX;

})(typeof exports === 'undefined' ? window : exports);
