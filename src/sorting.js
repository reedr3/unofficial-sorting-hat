var helper = require("./helper");
var skillVariables = require("./skill-variables");
var states = skillVariables["states"];
var messages = skillVariables["messages"];
var sortingSongs = skillVariables["sortingSongs"];
var sortingQuestions = skillVariables["sortingQuestions"];
var houseAnswers = skillVariables["houseAnswers"];
var houses = skillVariables["houses"];

module.exports = {

    'AnswerIntent': function () {

        // TODO
        // have several different numbers to choose from to determine number of questions each time
        // have a helper fn which scrambles order (maybe always have the 'not slytherin' question last)
        // if i really have too much time on my hands, could make a node progression so certain answers trigger certain questions, etc.. (could also determine the length based on which path down tree you take...)

        // gets the value of the answer the user gave
        var answer = this.event.request.intent.slots.Answer.value;
        helper.addHousePoint(this, answer);

        this.attributes.currentSortingQuestion += 1;
        var whichNextQuestionIndex = helper.getRandomIntInclusive(0, 3);

        if (this.attributes.currentSortingQuestion <= 4) {
          this.emit(':ask', sortingQuestions[this.attributes.currentSortingQuestion][whichNextQuestionIndex], sortingQuestions[this.attributes.currentSortingQuestion][whichNextQuestionIndex]);
        }
        else if (this.attributes.currentSortingQuestion > 4) {
          var houseChoice = helper.winningHouse(this);
          this.attributes.houseChoice = houseChoice;
          this.emit(':ask', messages["endOfSortingMessage"], messages["endOfSortingMessage"]);
        }
    },

    'ReadyIntent': function () {

      var house = helper.getHouseSpeech(this.attributes.houseChoice);

      this.handler.state = states.ANNOUNCEMODE;

      this.emit(':ask', messages["postSortingMessage"] + house + messages["postAnnounceMessage"], messages["postAnnounceMessage"]);
    },


     'AMAZON.StopIntent': function () {
         this.emit(':tell', messages["goodbyeMessage"]);
     },
     'AMAZON.CancelIntent': function () {
         this.emit(':tell', messages["goodbyeMessage"]);
     },
     'AMAZON.StartOverIntent': function () {
          this.emit(':ask', messages["startOverMessage"], messages["startOverMessage"]);
     },
     'AMAZON.HelpIntent': function () {
         this.emit(':ask', messages["helpMessage"], messages["helpMessage"]);
     },
     'Unhandled': function () {
         this.emit(':ask', messages["unhandleMessage"] + messages["sortingHelpMessage"], messages["sortingHelpMessage"]);
     }
};
