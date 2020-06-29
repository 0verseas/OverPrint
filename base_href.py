import os, subprocess


def main():
	if not os.path.isfile('dist/OverPrint/index.html'):
		print("dist folder not found.")

	print("Now building...")
	build_status_code = build()
	print("ng build done!")

	print("Editing index.html file in dist folder.")
	new_index_html = ""
	with open("dist/OverPrint/index.html", 'r', encoding="utf-8") as f:
		for line in f:
			if '<base href="/">' in line:
				line = line.replace('<base href="/">', '<base href="/distribution/">')
			new_index_html += line
	with open("dist/OverPrint/index.html", 'w', encoding="utf-8") as f:
		f.write(new_index_html)


def build():
	try:
		nb = subprocess.run(["ng build"], shell=True, stdout=subprocess.PIPE, check=True)
	except subprocess.CalledProcessError:
		print("build failed!")
	finally:
		print(nb.stdout.decode('utf-8'))

	return nb.returncode

if __name__ == '__main__':
	main()
