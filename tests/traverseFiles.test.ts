import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { traverseFiles } from '../src/index';
import { createTestDirectoryStructure } from './test-utils';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

describe('traverseFiles', () => {
    const testDir = join(process.cwd(), 'test-temp');

    beforeEach(async () => {
        await createTestDirectoryStructure(testDir);
    });

    afterEach(async () => {
        await rm(testDir, { recursive: true, force: true });
    });

    it('should find all files in directory and subdirectories', async () => {
        const files = await traverseFiles({
            directory: testDir,
            filter: () => true
        });

        expect(files.length).toBe(5);
        expect(files).toContain(join(testDir, 'file1.txt'));
        expect(files).toContain(join(testDir, 'file2.json'));
        expect(files).toContain(join(testDir, 'dir1', 'file3.txt'));
        expect(files).toContain(join(testDir, 'dir2', 'file4.json'));
        expect(files).toContain(join(testDir, 'dir2', 'subdir', 'file5.txt'));
    });

    it('should filter files by extension (.txt)', async () => {
        const files = await traverseFiles({
            directory: testDir,
            filter: (filePath) => filePath.endsWith('.txt')
        });

        expect(files.length).toBe(3);
        expect(files).toContain(join(testDir, 'file1.txt'));
        expect(files).toContain(join(testDir, 'dir1', 'file3.txt'));
        expect(files).toContain(join(testDir, 'dir2', 'subdir', 'file5.txt'));
        expect(files).not.toContain(join(testDir, 'file2.json'));
        expect(files).not.toContain(join(testDir, 'dir2', 'file4.json'));
    });

    it('should filter files by extension (.json)', async () => {
        const files = await traverseFiles({
            directory: testDir,
            filter: (filePath) => filePath.endsWith('.json')
        });

        expect(files.length).toBe(2);
        expect(files).toContain(join(testDir, 'file2.json'));
        expect(files).toContain(join(testDir, 'dir2', 'file4.json'));
        expect(files).not.toContain(join(testDir, 'file1.txt'));
    });

    it('should return empty array for non-matching filter', async () => {
        const files = await traverseFiles({
            directory: testDir,
            filter: (filePath) => filePath.endsWith('.xml')
        });

        expect(files).toEqual([]);
    });

    it('should handle non-existent directory gracefully', async () => {
        const files = await traverseFiles({
            directory: join(testDir, 'nonexistent'),
            filter: () => true
        });

        expect(files).toEqual([]);
    });
});
