# echochamber
**Tumblr-Blog-zu-Podcast-Feed-Konverter**

## Wozu?

Damit man den saetchmo-Blog (http://saetchmo.tumblr.com) als Audio-Podcast-Feed abonnieren kann.

## Wie installiert man's?

1. Downloaden,
2. `npm install` ausführen (um *mustache* und *request* zu installieren)
3. konfigurieren und
3. ggf. einen cronjob einrichten, damit `node scraper.js` regelmäßig (z.B. täglich) ausgeführt wird.

## Konfiguration

In der **`scraper.js`** sind in den ersten Zeilen die einzigen Parameter:

	var tumblrUrl = 'http://saetchmo.tumblr.com';
	var feedFilename = './echochamber.xml';

`tumblrUrl` gibt die Url zum Tumblr an, `feedFilename` legt fest, wo der fertige Feed abgelegt werden soll.

Ansonsten gibt es im Verzeichnis **`templates/`** die beiden Mustache-Templates, um den Feed anzupassen.



