import psycopg2
import argparse

class PSQL():
	def __init__(self, url):
		self.connection=None
		try:
		    self.connection=psycopg2.connect(url, sslmode='require')
		except Exception as e:
		    print "I am unable to connect to the database."
		    raise e
		
	def execute(self, command):
		try:
			print ('Executing: %s' % command)
			cursor=self.connection.cursor()
			cursor.execute(command)
			cursor.close()
			self.connection.commit()
			return command
		except Exception as e:
			print "Can't execute: %s" % command 
			raise e
    
	def create_table(self, table, columns):
		command = """CREATE TABLE %s(%s);""" % (table, columns)
		return self.execute(command)

	def insert(self, table, columns, values):
		command = """INSERT INTO %s(%s) VALUES %s;""" % (table, columns, values)
		return self.execute(command)

	def select(self, columns, table, conditions=None):
		command = """SELECT %s from %s""" % (columns, table)

		if conditions:
			command += ' WHERE %s' % conditions

		command += ';'

		try:
			cursor=self.connection.cursor()
			cursor.execute(command)
			rows = cursor.fetchall()
			return rows
		except Exception as e:
			print "Can't execute select: %s" % command
			raise e

	def update(self, table, column, values, conditions):
		command="""UPDATE %s SET %s = %s WHERE %s""" % (table, column, values, conditions)
		return self.execute(command)

	def delete(self, table, conditions):
		command="""DELETE FROM %s WHERE %s""" %(table, conditions)
		return self.execute(command)

	def drop_table(self, table):
		command="""DROP TABLE IF EXISTS %s;""" % table
		return self.execute(command)

	def create_update_function(self):
		command="""
		CREATE OR REPLACE FUNCTION updated_at_column_function() 
		RETURNS TRIGGER AS $$
		BEGIN
		    NEW.updated_at = now();
		    RETURN NEW; 
		END;
		$$ language 'plpgsql';
		"""
		return self.execute(command)

	def create_update_trigger(self, table):
		command="""CREATE TRIGGER updated_at_column_trigger BEFORE UPDATE ON %s FOR EACH ROW WHEN (NEW.term != 'Ongoing') EXECUTE PROCEDURE updated_at_column_function();""" % table
		return self.execute(command)

def main(url, action, table, columns, conditions, values):

	psql = PSQL(url)

	if action == 'create_table':
		psql.create_table(table, columns)
	elif action == 'select':
		print psql.select(columns, table, conditions)
	elif action == 'insert':
		psql.insert(table, columns, values)
	elif action == 'update':
		psql.update(table, columns, values, conditions)
	elif action == 'drop_table':
		psql.drop_table(table)
	elif action == 'delete':
		psql.delete(table, conditions)
	elif action == 'create_function':
		psql.create_update_function()
	elif action == 'create_trigger':
		psql.create_update_trigger(table)


if __name__ == '__main__':

	parser = argparse.ArgumentParser('Heroku Postgres database helper script')
	parser.add_argument('--url', help='db url', required=True)
	parser.add_argument('--action', help='What action to execute', choices=['create_table', 'create_function', 'create_trigger', 'select', 'insert', 'drop_table', 'update', 'delete'], required=True)
	parser.add_argument('--table', help='table name', required=True)
	parser.add_argument('--columns', help='columns name')
	parser.add_argument('--conditions', default=None, help='conditions for select')
	parser.add_argument('--values', help='values for insert')
	args = parser.parse_args()

	main(args.url, args.action, args.table, args.columns, args.conditions, args.values)
