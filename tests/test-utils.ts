import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function createTestDirectoryStructure(baseDir: string) {
  const dir1 = join(baseDir, 'dir1');
  const dir2 = join(baseDir, 'dir2');
  const subDir = join(dir2, 'subdir');

  // Create directories
  await mkdir(dir1, { recursive: true });
  await mkdir(dir2, { recursive: true });
  await mkdir(subDir, { recursive: true });

  // Create test files
  await writeFile(join(baseDir, 'file1.txt'), 'test');
  await writeFile(join(baseDir, 'file2.json'), 'test');
  await writeFile(join(dir1, 'file3.txt'), 'test');
  await writeFile(join(dir2, 'file4.json'), 'test');
  await writeFile(join(subDir, 'file5.txt'), 'test');
}
