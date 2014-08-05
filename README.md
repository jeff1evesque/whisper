Whisper
=======

This repository contains the required submodules to stream audio from the browser to the server.

###Definition

*Streaming* media is [multimedia](http://www.answers.com/topic/multimedia) that is constantly received by and presented to an [end-user](http://en.wikipedia.org/wiki/End-user_(computer_science)) while being delivered by a provider.

- http://en.wikipedia.org/wiki/Streaming_media

**Note:** the end-user in context of streaming audio would be the Server hosting this application, and the provider would be the clients browser.

*WebSocket* is a protocol providing [full-duplex](http://en.wikipedia.org/wiki/Full-duplex) communications channels over a single [TCP](http://en.wikipedia.org/wiki/Transmission_Control_Protocol) connection.  It is designed to be implemented in [web browsers](http://en.wikipedia.org/wiki/Web_browser) and [web servers](http://en.wikipedia.org/wiki/Web_server), but it can be used by any client or server application.

- http://en.wikipedia.org/wiki/WebSocket

###Overview

This project utilizes the [*WebSocket Protocol*](https://developer.mozilla.org/en-US/docs/WebSockets).  For the WebSockets to be able to communicate from the browser to the server (and vice versa), some configurations need to be made at each end.

First, a WebSocket server needs to be defined.  Since, [*AutobahnPython*](https://github.com/tavendo/AutobahnPython) is the chosen server-side implementation, the corresponding [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py) will need to utilize the respective [interfaces](https://github.com/tavendo/AutobahnPython/blob/master/autobahn/autobahn/websocket/interfaces.py).

Once the server has been created, the client-side scheme needs to be defined.  This project chooses to use javascript [*WebSocket Protocols*](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications).  Other client-side schemes are possible (i.e. [*AutobahnJS*](https://github.com/tavendo/AutobahnJS) -> [*WAMP Protocol*](http://wamp.ws/) instead of pure [*WebSockets*](https://developer.mozilla.org/en-US/docs/WebSockets)).  However, this may change the server-side implementation of this project.

##Installation

###Linux Packages

The following packages need to be installed through terminal in Ubuntu:

```
sudo apt-get install libappindicator1
sudo apt-get install libindicator7
```

###Google Chrome

This project requires testing the functionality of [`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator.getUserMedia).  The [Google Chrome](https://www.google.com/intl/en_us/chrome/browser/) browser, ensures, and provides this functionality.

```
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install google-chrome-stable
```

**Note:** This project assumes [Ubuntu Server 14.04](http://www.ubuntu.com/download/server) as the operating system.

##Configuration

###GIT

####GIT Submodule

##Execution
