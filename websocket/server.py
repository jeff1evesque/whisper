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
#    # Encode JSON-formatted string
#    json_input = json.dumps([ "one": 1, "two": { "list": [ {"aa":"A"},{"ab":"B"} ] } ])
#
#    # Prints 'B'
#    print decoded['two']['list'][1]['ab']
#
#    # Prints entire JSON-formatted string nicely
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
