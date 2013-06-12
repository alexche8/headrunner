#!/usr/bin/env python

import operator, os, pickle, sys

import cherrypy

from jinja2 import Environment, PackageLoader, FileSystemLoader

jinja_environment = Environment(autoescape=True,
        loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))

STATIC_URL = '/static/'

class Root(object):

    def __init__(self, data):
        self.data = data

    @cherrypy.expose
    def index(self):
        return jinja_environment.get_template('index.html').render(STATIC_URL=STATIC_URL)

def main(filename):
    data = {} # We'll replace this later

    # Some global configuration; note that this could be moved into a
    # configuration file
    cherrypy.config.update({
        'tools.encode.on': True, 'tools.encode.encoding': 'utf-8',
        'tools.decode.on': True,
        'tools.trailing_slash.on': True,
        'tools.staticdir.root': os.path.abspath(os.path.dirname(__file__)),
	'server.socket_port': 8099
        })

    cherrypy.quickstart(Root(data), '/', {
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.abspath(os.path.join(os.path.dirname(__file__), 'static'))
        },
        '/data': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
        },
        '/images': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.abspath(os.path.join(os.path.dirname(__file__), 'images'))
        }
    })

if __name__ == '__main__':
    main(sys.argv[1])
