import os
import unittest

from config import basedir
from harmony import app, db
from models import Room, Operation, Player

class DatabaseTest(unittest.TestCase):

	def setUp(self):
		app.config['TESTING'] = True
		app.config['WTF_CSRF_ENABLED'] = False
		app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'
		self.app = app.test_client()
		db.create_all()

	def tearDown(self):
		db.session.remove()
		db.drop_all()

	def test_add_player(self):
		p1 = Player("Yogo")
		p2 = Player("Andhieka")
		db.session.add(p1)
		db.session.add(p2)
		db.session.commit()
		assert p1.id == 1
		assert p2.id == 2

	def test_add_room(self):
		r1 = Room()
		r2 = Room()
		db.session.add(r1)
		db.session.add(r2)
		db.session.commit()
		assert r1.id == 1
		assert r2.id == 2

	def test_room_init(self):
		r1 = Room()
		p1 = Player("P1")
		p2 = Player("P2")
		p3 = Player("P3")
		db.session.add(r1)
		db.session.add(p1)
		db.session.add(p2)
		db.session.add(p3)
		db.session.commit()
		assert r1.started == False
		assert r1.players == []

		p1.room_id = 1
		p2.room_id = 1
		p3.room_id = 1
		db.session.commit()
		assert r1.players == [p1, p2, p3]

		r1.start_game()
		db.session.commit()
		assert r1.key is not None
		assert r1.get_active_player_id() == 1
		assert p1.active == True
		assert p2.active == False
		assert p3.active == False
		print("Key = {0}".format(r1.key))

		r1.update_turn()
		assert p1.active == False
		assert p2.active == True
		assert p3.active == False

		r1.update_turn()
		assert p1.active == False
		assert p2.active == False
		assert p3.active == True

		r1.update_turn()
		assert p1.active == True
		assert p2.active == False
		assert p3.active == False

	def test_operations(self):
		r1 = new Room()
		db.session.add(r1)
		db.session.commit()

		op1 = new Operation(1, )

if __name__ == '__main__':
	unittest.main()

