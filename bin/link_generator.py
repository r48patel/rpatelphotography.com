import argparse

parser = argparse.ArgumentParser(description='Get links and amount')
parser.add_argument('--link', help='What\'s the link', required=True)
parser.add_argument('--amount', type=int, help='How many times do itterate', required=True)
parser.add_argument('--extension', default='JPG', help='What\'s the file extension')
parser.add_argument('--start-at', type=int, help='Where to start the count from.', default=1)

args = parser.parse_args()

for i in range(args.start_at, args.amount+1):
	print '%s/%s.%s' % (args.link, i, args.extension)