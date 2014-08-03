"""
@server.py
This file contains the server side of the Autobahn websocket service
"""

import json
from twisted.internet import reactor

from autobahn.twisted.websocket import WebSocketServerFactory, \
                                       WebSocketServerProtocol, \
                                       listenWS

## @StreamingServerProtocol
#
#  Parse JSON-formatted string
#
#    json_input = '{ "one": 1, "two": { "list": [ {"item":"A"},{"item":"B"} ] } }'
#
#    # prints 'B'
#    print decoded['two']['list'][1]['item']
#
#    # prints nicely entire JSON-formatted string
#    print json.dumps(decoded, sort_keys=True, indent=4)

class StreamingServerProtocol(WebSocketServerProtocol):

   def onMessage(self, msg, binary):
      WebSocketServerProtocol.onMessageBegin(self, binary)
      print 'sending echo:', msg
      self.sendMessage(msg, binary)

if __name__ == '__main__':
   factory = WebSocketServerFactory("ws://localhost:9001")
   factory.protocol = StreamingServerProtocol
   listenWS(factory)
   reactor.run()
