#!/usr/bin/python3
import json
from datetime import datetime
from pathlib import Path

import requests

dir_path = Path(__file__).parent.resolve()

# updates leaderboards file
def download_leaderboard(multi: str) -> None:
	req_t = "https://www.codingame.com/services/LeaderboardsRemoteService/getFilteredPuzzleLeaderboard"
	arg = "[" + multi + ", undefined, global, { active: false, column: undefined, filter: undefined}]"

	headers={
		"Content-type":"application/json",
		"Accept":"application/json",
	}

	r = requests.post(req_t, data=arg, headers=headers, timeout=2)
	d = r.json()
	if "error" in d:
		print(str(datetime.now()) + ": skip multi " + multi + ", got the API error :" + d["error"]["message"])
		return

	try:
		filepath = Path(dir_path) / "leaderboards" / f"{multi}.json"
		with filepath.open("w") as f:
			f.write(json.dumps(d))
	except ValueError:
		print(str(datetime.now()) + ": could not dump json of " + multi + ": " + ValueError)

def get_multi_list() -> list[str]:
	# Method courtesy of Neumann
	# First get the global puzzle list
	headers={
		"Content-type":"application/json",
		"Accept":"application/json",
	}
	req_t = "https://www.codingame.com/services/Puzzle/findAllMinimalProgress"
	r = requests.post(req_t, data="[null]", headers=headers, timeout=2)
	d = r.json()
	if "error" in d:
		print(str(datetime.now()) + ": failed to fetch multi list, got the API error :" + d["error"]["message"])
		return None

	multi_ids = []
	for game in d:
		if game["level"] == "multi":
			multi_ids.append(game["id"])

	# Then get the details on every multi
	req_t = "https://www.codingame.com/services/Puzzle/findProgressByIds"
	r = requests.post(req_t, data=f"[{multi_ids}, null, 1]", headers=headers, timeout=2)
	d = r.json()
	if "error" in d:
		print(str(datetime.now()) + ": failed to fetch multi list, got the API error :" + d["error"]["message"])
		return None

	multis = []
	for game in d:
		multis.append(game["puzzleLeaderboardId"])
	
	return multis

if __name__ == "__main__":
	games = get_multi_list()
	leaderboards_folder = Path(dir_path) / "leaderboards"
	if not leaderboards_folder.exists():
		leaderboards_folder.mkdir()

	for game in games:
		download_leaderboard(game)
