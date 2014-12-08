from flask import Flask, jsonify, redirect, render_template, session, request
from flask.ext.sqlalchemy import SQLAlchemy

import logging
from logging.handlers import RotatingFileHandler

from forms import LoginForm

app = Flask(__name__, static_url_path='')
app.config.from_object('config')

db = SQLAlchemy(app)


### Database Model

from datetime import datetime, timedelta
import random

notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

class Player(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(200), index=True)
	active = db.Column(db.Boolean)
	room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=True)
	room = db.relationship('Room', backref='players')
	score = db.Column(db.Integer)

	def __init__(self, name):
		self.name = name

	def __repr__(self):
		return '<Player {0}: {1}>'.format(self.id, self.name)

	@property
	def serialize(self):
		return {
			'id': self.id,
			'name': self.name,
			'active': self.active,
			'room_id': self.room_id,
			'score': self.score
		}

class Room(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	# players (backref from Player class)
	started = db.Column(db.Boolean, default=False)
	turnover_time = db.Column(db.DateTime)
	turn_index = db.Column(db.Integer, default=-1)
	turn_completed = db.Column(db.Boolean, default=False)
	num_of_players = db.Column(db.Integer, default=0)
	key = db.Column(db.String(10))
	board = db.Column(db.Text)

	def __repr__(self):
		return '<Room {0}>'.format(self.id)

	def get_active_player_id(self):
		if not self.started:
			return -1

		if datetime.now() > self.turnover_time:
			update_turn()
		return self.players[self.turn_index].id;

	def start_game(self):
		if not self.started:
			for p in self.players:
				self.num_of_players += 1
			if self.num_of_players == 0:
				return -1
			self.started = True
			self.update_turn()
			self.key = notes[random.randint(0, 11)]
		return self.get_active_player_id()

	def update_turn(self):
		self.turnover_time = datetime.now() + timedelta(seconds=10)
		self.turn_index = (self.turn_index + 1) % self.num_of_players
		for i in range(0, self.num_of_players):
			if (i == self.turn_index):
				self.players[i].active = True
			else:
				self.players[i].active = False

	@property
	def serialize(self):
		return {
			'id': self.id,
			'started': self.started,
			'turnover_time': self.turnover_time,
			'active_player_id': self.get_active_player_id(),
			'num_of_players': self.num_of_players,
			'key': self.key,
			'players': [p.serialize for p in self.players],
			'board': self.board,
			'stack': [o.serialize for o in self.operations]
		}

class Operation(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	row = db.Column(db.Integer)
	column = db.Column(db.Integer)
	card = db.Column(db.String(10))
	time = db.Column(db.DateTime)
	room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
	room = db.relationship('Room', backref='operations')

	def __init__(self, room_id, row, column, card):
		self.room_id = room_id
		self.row = row
		self.column = column
		self.card = card
		self.time = datetime.now()

	@property
	def serialize(self):
	    return {
	    	'id': self.id,
	    	'row': self.row,
	    	'column': self.column,
	    	'card': self.card,
	    	'time': self.time,
	    	'room_id': self.room_id,
	    }
	

if Room.query.all() == []:
	r1 = Room()
	r2 = Room()
	db.session.add(r1)
	db.session.add(r2)
	db.session.commit()






### Router

@app.route('/')
def index():
	if not 'user_id' in session:
		return redirect('/login')
	return app.send_static_file('index.html')



# Things of things to implement:
# - Synchronization of game states between players in a room
# - Deciding which player is active (turn decision)
# - Supporting multiple rooms

@app.route('/login', methods=['GET', 'POST'])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		name = form.name.data
		p = Player(name)
		db.session.add(p)
		db.session.commit()
		app.logger.info("{0} {1}".format(p.id, p.name))
		session['user_id'] = p.id
		session['user_name'] = p.name
		return redirect('/')
	return render_template('login.html', title='login', form=form)

@app.route('/logout')
def logout():
	session.pop('user_id', None)
	session.pop('user_name', None)
	return redirect('/')

@app.route('/api/rooms', methods=['GET', 'POST'])
def rooms():
	result = []
	for room in Room.query.all():
		result.append(room.id)
	return jsonify(room_ids=result)

@app.route('/api/rooms/<room_number>', methods=['GET']) #, 'POST'])
def roomInfo(room_number):
	room = Room.query.get(room_number)
	return jsonify(room=room.serialize)
	

@app.route('/api/player/info')
def showPlayerInfo():
	# Return id, room and other info for this player based on cookie
	player = Player.query.get(session['user_id'])
	return jsonify(player=player.serialize)

@app.route('/api/player/updatescore/<score>')
def updateScore(score):
	player = Player.query.get(session['user_id'])
	player.score = score
	db.session.commit()
	return jsonify(player=player.serialize)

@app.route('/api/update/<int:row>/<int:col>/<tile>')
def updateCommandStack(row, col, tile):
	# check that the player requesting this update is active player
	# if yes:
	# push to command stack the row, col, and type of tile being added
	# also add info on time of update
	# and proceed to the next player
	player = Player.query.get(session['user_id'])
	if not player.active:
		return jsonify(status="Error. Player not active")
	room = player.room
	
	op = Operation(room.id, row, col, tile)
	db.session.add(op)
	db.session.commit()

	room.update_turn()
	return jsonify(status="success")

@app.route('/api/get/command_stack')
def getCommandStack():
	player = Player.query.get(session['user_id'])
	room = player.room
	ops = room.operations
	return jsonify(stack=[o.serialize for o in ops])


if __name__ == "__main__":
	handler = RotatingFileHandler('harmony.log', maxBytes=10000, backupCount=1)
	handler.setLevel(logging.INFO)
	app.logger.addHandler(handler)
	app.run(debug=True)





