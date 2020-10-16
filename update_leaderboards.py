#!/usr/bin/python3
import os
import json
import sys
import time
from datetime import datetime
import requests


dir_path = os.path.dirname(os.path.realpath(__file__))

# updates leaderboards file
def download_leaderboard(multi):
	req_t = 'https://www.codingame.com/services/LeaderboardsRemoteService/getFilteredPuzzleLeaderboard'
	arg = "[" + multi + ", undefined, global, { active: false, column: undefined, filter: undefined}]"

	r = requests.post(req_t, data=arg)
	d = r.json()
	if "error" in d:
		print(str(datetime.now()) + ": skip multi " + multi + ", got the API error :" + d["error"]["message"])
		return

	try:
		if not os.path.exists(os.path.join(dir_path,"leaderboards")):		# create the directory if it doesn't exists 
			os.mkdir(os.path.join(dir_path,"leaderboards"))
		
		with open(os.path.join(dir_path,"leaderboards",multi+".json"), "w") as f:
			f.write(json.dumps(d))
	except ValueError:
		print(str(datetime.now()) + ": could not dump json of " + multi + ": " + ValueError)



if __name__ == "__main__":
	games = ["a-code-of-ice-and-fire", "code-a-la-mode", "cultist-wars", "bandas", "bit-runner-2048", "yavalath", "langton-s-ant", "checkers", "vindinium", "legends-of-code-magic", "code-of-kutulu", "code-royale", "tic-tac-toe", "botters-of-the-galaxy", "code4life", "mean-max", "wondev-woman", "coders-of-the-caribbean",  "ghost-in-the-cell", "fantastic-bits", "hypersonic", "codebusters", "smash-the-code", "coders-strike-back", "back-to-the-code", "great-escape", "platinum-rift2", "platinum-rift", "poker-chip-race", "game-of-drone", "tron-battle", "xmas-rush"]
	for game in games:
		path_file = os.path.join("leaderboards", game + '.json')

		# check if the file is recent enough
		# timestamp = os.stat(path_file).st_mtime
		# if time.time() - timestamp > 3000:
		download_leaderboard(game)
