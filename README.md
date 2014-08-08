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

This project utilizes the [*WebSocket Protocol*](https://developer.mozilla.org/en-US/docs/WebSockets).  Some configurations need to be made at each end, in order for WebSockets to be able to communicate from the browser to the server (and vice versa):

First, a WebSocket server needs to be defined.  Since [*AutobahnPython*](https://github.com/tavendo/AutobahnPython) is the chosen server-side implementation, the corresponding [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py) will need to utilize the respective [interfaces](https://github.com/tavendo/AutobahnPython/blob/master/autobahn/autobahn/websocket/interfaces.py).

Once the server has been created, the client-side implementation needs to be defined.  This project chooses to use the javascript [*WebSocket Protocols*](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications).  However, other client-side schemes are possible, for example, [*AutobahnJS*](https://github.com/tavendo/AutobahnJS).  Implementing *AutobahnJS* on the client-side, would require the use of the [*WAMP Protocol*](http://wamp.ws/) on the server-side (provided in AutobahnPython) as well.  The change from [*WebSockets*](https://developer.mozilla.org/en-US/docs/WebSockets), to the *WAMP Protocol* would change [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py), respectively.

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

Fork this project in your GitHub account, then clone your repository:

```
cd /var/www/html/
sudo git clone https://[YOUR-USERNAME]@github.com/[YOUR-USERNAME]/whisper.git whisper
```

Then, add the *Remote Upstream*, this way we can pull any merged pull-requests:

```
cd /var/www/html/whisper/
git remote add upstream https://github.com/[YOUR-USERNAME]/whisper.git
```

####GIT Submodule

We need to initialize our git *submodules*:

```
sudo git submodule init
sudo git submodule update
```

**Note:** We have to use the *sudo* prefix, since we haven't taken care of file permissions yet.

The above two commands will update submodules.  If they are already initialized, then the latter command will suffice. Then, we need to pull the code-base into the initialized submodule directory:

```
cd /var/www/html/whisper/
git checkout -b NEW_BRANCH master
cd [YOUR_SUBMODULE]/
git checkout master
git pull
cd ../
git status
```

Now, commit and merge the submodule changes.

###File Permission

Change the file permission for the entire project by issuing the command:

```
cd /var/www/html/
sudo chown -R jeffrey:sudo whisper
```

**Note:** change 'jeffrey' to the user account YOU use.

###Twisted

AutobahnPython [runs](http://autobahn.ws/python/installation.html#requirements) on either the [Twisted](https://github.com/twisted/twisted), or the [asyncio](https://docs.python.org/3.4/library/asyncio.html) networking frameworks.

```
cd /var/www/html/whisper/twisted
sudo python setup.py install
```

**Note:** Generally *Twisted* is the framework of choice if the environment only provides python 2.x, whereas *asyncio* is generally preferred if the environment is python 3.x.  *Twisted* will [support](http://twistedmatrix.com/trac/milestone/Python-3.x) python3.x.

##WebSocket Execution

###Start Server

In order for the browser to be able to connect to the [AutobahnPython](https://github.com/tavendo/AutobahnPython) Webserver, [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py) needs to be executed:

```
cd /var/www/html/whisper/websocket/
python server.py
```

This will *dedicate* the terminal window tab specifically to the server, and unresponsive to other commands.

###Stop Server

The *WebSocket Server* can be *stopped* within the *dedicated* terminal console by pressing `ctrl-c`.

###Server Echo

Periodically, *print* statements within the *dedicated terminal* will display the status of certain actions.  For example, when a [*WebSocket Server*](http://www.html5rocks.com/en/tutorials/websockets/basics/) is connected, then started:

```
sending echo: CONNECTED TO YOU
sending echo: start
```

Likewise, when the *WebSocket Server* is stopped:

```
sending echo: stop
```

Other *print* statements may appear in the *dedicated* terminal console, and will vary accordingly. 
