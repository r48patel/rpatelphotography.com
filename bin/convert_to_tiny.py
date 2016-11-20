import tinyurl
import os
url='https://lh3.google.com/u/0/d/1V38QqLV8IjKHq26YfavfxOUVzlsXKDn7nA=w1920-h955-iv1'
tiny_url=tinyurl.create_one(url)
with open('../views/templates/projects.txt', 'r') as projects_file:
	for project in projects_file.readlines():
		project_file_name = '../views/templates/projects/' + project.replace('\n', '')
		if os.path.isfile(project_file_name):
			print 'Converting: ' + project_file_name
			project_file = open(project_file_name, 'r')
			all_project_file_lines = project_file.readlines()
			new_project_file_lines = []
			project_file = open(project_file_name, 'w+')
			for picture in all_project_file_lines:
				line_in_list = picture.split(';')
				picture_url = line_in_list[0]
				if picture_url.startswith('http') and 'tinyurl' not in picture_url:
					new_url = tinyurl.create_one(picture_url)
					print '    ' + new_url
					line_in_list[0] = new_url
				new_project_file_lines.append(';'.join(line_in_list))

			project_file.writelines(new_project_file_lines)
			project_file.close()