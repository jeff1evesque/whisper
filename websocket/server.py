"""
@server.py
This file contains the server side of the Autobahn websocket service
"""

import json
from twisted.internet import reactor

from autobahn.twisted.websocket import WebSocketServerFactory, \
                                       WebSocketServerProtocol, \
                                       listenWS


class StreamingHashServerProtocol(WebSocketServerProtocol):
   """
   Streaming WebSockets server that computes a running SHA-256 for data
   received. It will respond every BATCH_SIZE bytes with the digest
   up to that point. It can receive messages of unlimited number of frames
   and frames of unlimited length (actually, up to 2^63, which is the
   WebSockets protocol imposed limit on frame size). Digest is reset upon
   new message.
   """

   def onMessage(self, msg, binary):
      WebSocketServerProtocol.onMessageBegin(self, binary)
      print 'sending echo:', msg
      self.sendMessage(msg, binary)

if __name__ == '__main__':
   factory = WebSocketServerFactory("ws://localhost:9001")
   factory.protocol = StreamingHashServerProtocol
   listenWS(factory)
   reactor.run()
