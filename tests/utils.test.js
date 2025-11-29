const { calculatePowerZone, formatTime, generateTCX } = require('../utils');

describe('Utility Functions', () => {

    describe('calculatePowerZone', () => {
        const ftp = 200;

        test('should return ZONE 1 for power < 55% of FTP', () => {
            const result = calculatePowerZone(100, ftp); // 50%
            expect(result.name).toContain('ZONE 1');
            expect(result.class).toBe('zone-z1');
        });

        test('should return ZONE 2 for power 55-75% of FTP', () => {
            const result = calculatePowerZone(140, ftp); // 70%
            expect(result.name).toContain('ZONE 2');
            expect(result.class).toBe('zone-z2');
        });

        test('should return ZONE 7 for power > 150% of FTP', () => {
            const result = calculatePowerZone(400, ftp); // 200%
            expect(result.name).toContain('ZONE 7');
            expect(result.class).toBe('zone-z7');
        });

        test('should handle missing FTP gracefully', () => {
            const result = calculatePowerZone(100, null);
            expect(result.name).toBe('ZONE --');
            expect(result.class).toBe('');
        });
    });

    describe('formatTime', () => {
        test('should format seconds correctly', () => {
            expect(formatTime(0)).toBe('00:00:00');
            expect(formatTime(9)).toBe('00:00:09');
            expect(formatTime(60)).toBe('00:01:00');
            expect(formatTime(3661)).toBe('01:01:01');
        });
    });

    describe('generateTCX', () => {
        test('should return empty string for empty data', () => {
            expect(generateTCX([])).toBe('');
            expect(generateTCX(null)).toBe('');
        });

        test('should generate valid TCX XML structure', () => {
            const mockData = [
                {
                    time: new Date('2023-01-01T10:00:00Z'),
                    elapsed: 0,
                    hr: 120,
                    power: 150,
                    cadence: 80,
                    speed: 25
                },
                {
                    time: new Date('2023-01-01T10:00:01Z'),
                    elapsed: 1,
                    hr: 122,
                    power: 155,
                    cadence: 82,
                    speed: 26
                }
            ];

            const tcx = generateTCX(mockData);

            expect(tcx).toContain('<?xml version="1.0" encoding="UTF-8"?>');
            expect(tcx).toContain('<TrainingCenterDatabase');
            expect(tcx).toContain('<Activity Sport="Biking">');
            expect(tcx).toContain('<Id>2023-01-01T10:00:00.000Z</Id>');

            // Check first trackpoint
            expect(tcx).toContain('<Time>2023-01-01T10:00:00.000Z</Time>');
            expect(tcx).toContain('<Value>120</Value>'); // HR
            expect(tcx).toContain('<Watts>150</Watts>');
            expect(tcx).toContain('<Cadence>80</Cadence>');

            // Check speed conversion (25 km/h -> 6.944 m/s)
            expect(tcx).toContain('<Speed>6.944</Speed>');
        });
    });
});
