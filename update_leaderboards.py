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
		with open(os.path.join(dir_path,"leaderboards",multi+".json"), "w") as f:
			f.write(json.dumps(d))
	except ValueError:
		print(str(datetime.now()) + ": could not dump json of " + multi + ": " + ValueError)

def get_multi_list():
	# Method courtesy of Neumann
	# First get the global puzzle list
	req_t = 'https://www.codingame.com/services/PuzzleRemoteService/findAllMinimalProgress'
	r = requests.post(req_t, data="[null]")
	d = r.json()
	if "error" in d:
		print(str(datetime.now()) + ": failed to fetch multi list " + multi + ", got the API error :" + d["error"]["message"])
		return

	multiIds = []
	for game in d:
		if game["level"] == "multi":
			multiIds.append(game["id"])

	# Then get the details on every multi
	req_t = 'https://www.codingame.com/services/PuzzleRemoteService/findProgressByIds'
	r = requests.post(req_t, data=f"[{multiIds}, null, 1]")
	d = r.json()
	if "error" in d:
		print(str(datetime.now()) + ": failed to fetch multi list " + multi + ", got the API error :" + d["error"]["message"])
		return

	multis = []
	for game in d:
		multis.append(game["puzzleLeaderboardId"])
	
	return multis

if __name__ == "__main__":

	games = get_multi_list()

	if not os.path.exists(os.path.join(dir_path,"leaderboards")):		# create the directory if it doesn't exist 
		os.mkdir(os.path.join(dir_path,"leaderboards"))

	for game in games:
		download_leaderboard(game)
