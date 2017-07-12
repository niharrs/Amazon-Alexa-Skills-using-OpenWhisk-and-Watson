var watson = require ('watson-developer-cloud');

var tone_analyzer = watson.tone_analyzer({
  username:'<your username>',
  password:'<your password>',
  version: 'v3',
  version_date: '2016-05-19'
});

var facts = [
  "Cows have best friends and they tend to spend most of their time together.",
  "Even if they've never been able to witness it themselves, blind people smile when they are happy. Smiling is a basic human instinct.",
  "The actor who is the voice of Winnie the Pooh calls up children in cancer wards to cheer them up.",
  "In 1941, there were only 11 functioning democracies in the world.",
  "Picasso painted using ordinary house paint.",
  "One-third of the population of China can't speak Mandarin, the country's official language."
];

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max-min+1)) + min;
};

function randomFact(){
  return facts[getRandomInt(0, facts.length-1)];
};

function main(args){
  var intent = args.request.intent;
  var text = '';

  if (intent.name === 'randomFact'){
    text+=randomFact();

    var response = {
      "version": "1.0",
      "response": {
        "shouldEndSession": true,
        "outputSpeech":{
          "type": "PlainText",
          "text": "Here is a random fact: " + text
        }
      }
    };
    return response;
  }

  if (intent.name === 'happyFact'){
    return new Promise ((resolve, reject) => {
      facts.forEach(function(fact){
        tone_analyzer.tone({text:fact}, (err, tone) => {
          if(err){
            return reject (err);
          } else {
            tone.document_tone.tone_categories[0].tones.forEach(function(entry){
              if (entry.tone_name == "Joy" && entry.score >= 0.5){
                text = "Here is a happy fact for you: " + fact;
                console.log(tone);

                var response = {
                  "version": "1.0",
                  "response": {
                    "shouldEndSession": true,
                    "outputSpeech":{
                      "type": "PlainText",
                      "text": "Here is a happy fact: " + text
                    }
                  }
                };
                return resolve (response);
              }
            });
          }
        });
      });
    });
  }
}

exports.main = main;
