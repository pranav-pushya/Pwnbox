import os
import subprocess
from pathlib import Path
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

tmp_dir = Path("scratch/tmp").resolve()
tmp_dir.mkdir(parents=True, exist_ok=True)

env = os.environ.copy()
env['TEMP'] = str(tmp_dir)
env['TMP'] = str(tmp_dir)

print("Executing: firebase deploy --only hosting ...")
res = subprocess.run(
    ['firebase.cmd', 'deploy', '--only', 'hosting'],
    env=env,
    shell=True,
    capture_output=True,
    text=True,
    encoding='utf-8',
    errors='replace'
)

print("STDOUT:")
print(res.stdout)
if res.stderr:
    print("STDERR:")
    print(res.stderr)

print(f"Exit code: {res.returncode}")
sys.exit(res.returncode)
