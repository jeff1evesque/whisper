## @server.py
#  This file contains the server side of the Autobahn websocket service

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
#
#  The following methods are triggered on the server side:
#
#  onConnect(self, requestOrResponse) callback fired during WebSocket opening handshake
#    when client connects, or when server connection established (by a client with 
#    response from server).
#
#  onOpen(self) callback fired when initial WebSocket opening handshake was completed.
#    You now can send and receive WebSocket messages.
#
#  sendMessage(self, payload, isBinary = False, fragmentSize = None, sync = False,
#    doNotCompress = False) send a WebSocket message over the connection to the peer.
#
#  onMessage(self, payload, isBinary) callback fired when a complete WebSocket message
#    was received.
#
#  sendClose(self, code = None, reason = None) starts WebSocket closing handshake.
#
#  onClose(self, wasClean, code, reason) callback when the WebSocket connection has been
#    closed (WebSocket closing handshake has been finished or the connection was closed
#    uncleanly).
#
#  A more complete list of available 'WebSocket' interfaces:
#
#  github.com/tavendo/AutobahnPython/blob/master/autobahn/autobahn/websocket/interfaces.py

class StreamingServerProtocol(WebSocketServerProtocol):

   def onMessage(self, msg, binary):
      print 'sending echo:', msg
      # send 'msg' back to the client (i.e. javascript)
      self.sendMessage(msg, binary)

if __name__ == '__main__':
   factory = WebSocketServerFactory("ws://localhost:9001")
   factory.protocol = StreamingServerProtocol
   listenWS(factory)
   reactor.run()
