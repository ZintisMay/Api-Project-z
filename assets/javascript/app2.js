//zintis - these are my arrays for local up/downvote storage (no infinite voting)
var zintisArray = [];
var color = "";
// var zintisArrayDown = [];

// Setting up the Firebase.
var tableData = new Firebase("https://api-project.firebaseio.com/")

// Setting up variables that will be pushed to the Firebase.
var currentDay = moment().format("MM/DD");
var functionName = "";
var language = "";
var syntax = "";
var description = "";

// This is the big search button on the page. It currently does nothing.
$("#submitbutton").click(function() {

});

// All of this happens when you click the "add a function/method button"...
$("#functionButton").click(function() {
	
	// Takes the values from the input boxes and stores them as variables.
	functionName = $("#nameBox").val()
	language = $("#languageBox").val()
	syntax = $("#syntaxBox").val()
	description = $("#descriptionBox").val()

	// Clears all of the input boxes.
	$("#nameBox").val(null)
	$("#languageBox").val(null)
	$("#syntaxBox").val(null)
	$("#descriptionBox").val(null)

	// Creates the url that will be used for the YouTube API call. 
	var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + functionName + "&key=AIzaSyDhXnzU5IOira_ZSXqhw1wI84bHucG7YNI";

	// The API call for YouTube.
	$.ajax({url: queryURL, method: 'GET'}).done(function(data) {

		// Saves the video ID of the first result into a variable.
		var videoID = data.items[0].id.videoId;

		// Pushes all of the saved variables into the Firebase. 
		tableData.push ({
			functionName: functionName,
			language: language,
			syntax: syntax,
			description: description,
			date: currentDay,
			youtubeID: videoID
		});

	});

});

// All of this happens when the page loads, and then again when a new child is added. The code runs for each child in the database. 
tableData.on('child_added', function(childSnapshot, prevChildKey) {


	// Setting up a variable for the table row.
	var tableEntry = $("<tr>")

	//---------------------------------------------------------------------------------------------------
		
//zintis - creates two buttons with checkmark and x

		var tableButtonUp = $("<button class='upvote'><span class='glyphicon glyphicon-ok'></span></button>");	
		
		var tableButtonDown = $("<button class='downvote'><span class='glyphicon glyphicon-remove'></span></button></div>");
		
//assigns data-names for future reference		
		tableButtonUp.attr("data-name", childSnapshot.key());

		tableButtonDown.attr("data-name", childSnapshot.key());

//makes a td element, and sticks both buttons on it
		var tableButtons = $("<td>") 

		tableButtons.append(tableButtonUp);

		tableButtons.append(tableButtonDown);
		

									// console.log("tablebutton");
									// console.log(childSnapshot.key());

//makes a td element to hold the rating number
		var ratingTD = $("<td>")

//gets and sticks the firebase rating onto the id of the rating number, for future reference
		ratingTD.append(childSnapshot.val().rating);
		ratingTD.attr("id", childSnapshot.key() + "tabledata");
		ratingTD.attr("data-color", "black");

//the append has been stuck in the append group near the end-------
// tableEntry.append(ratingTD);
			

	//---------------------------------------------------------------------------------------------------


	// Creates a <td> for function/method name and adds it. 
	var nameTD = $("<td>")
	nameTD.append(childSnapshot.val().functionName)

	// Creates a <td> for the language and adds it. 
	var languageTD = $("<td>")
	languageTD.append(childSnapshot.val().language)

	// Creates a <td> for the description and adds it. 
	var descriptionTD = $("<td>")
	descriptionTD.append(childSnapshot.val().description)

	// Creates a <td> for the syntax and adds it. 
	var syntaxTD = $("<td>")
	syntaxTD.append(childSnapshot.val().syntax)

	// Creates a <td> for the resource links. 
	var resourceTD = $("<td>")

	// The variable for the YouTube link.
	var link = $("<a>")
	link.text("YouTube")

	// This is the code that will make the modal appear when you click the link.
	link.attr("data-toggle", "modal")
	link.attr("data-target", ".bs-example-modal-lg")

	// Adds a click function for the YouTube link.
	link.click(function() {
		// Emptys the modal body.
		$("#modalbody").empty();
		// Appends the appropriate video to the modal.
		$("#modalbody").append('<iframe width="560" height="315" src="http://www.youtube.com/embed/' + childSnapshot.val().youtubeID + '" frameborder="0" allowfullscreen></iframe>');
		// Changes the title on the modal.
		$("#myModalLabel").html("Additional Resources - YouTube")
	})

	// Adds the link to the resources <td>
	resourceTD.append(link)

	// ------Reddit----------------------------------------------------------------

		// The varriable for the Reddit Link.
		var redditLink = $("<a>")
		redditLink.text("Reddit")

		// This is the code that will make the modal appear when you click the link.
		redditLink.attr("data-toggle", "modal")
		redditLink.attr("data-target", ".bs-example-modal-lg")

		// Adds a click function for the Reddit link.
		redditLink.click(function() {

			// Emptys the modal body.
			$("#modalbody").empty();

			// Changes the title on the modal.
			$("#myModalLabel").html("Additional Resources - Reddit")

			// The url for the Reddit API call.
			var redditURL = 'https://api.pushshift.io/reddit/search/submission?q="' + childSnapshot.val().functionName + '"&subreddit=javascript&limit=5';

			// The Reddit API call.
			$.ajax({url: redditURL, method: 'GET'}).done(function(response) {

				// Stuff for testing.
				console.log("-----Reddit API call-----");
				console.log(redditURL);
				console.log(response);
		
				// This code makes links out of the first 5 results from Reddit.
				for ( x = 0; x < 5; x++ ) {
					var linky = $("<a>")
					linky.text(response.data[x].title)
					linky.attr("href", response.data[x].url)
					linky.attr("target", "_blank")
					$("#modalbody").append( linky );
					$("#modalbody").append( "<br>" );
				};

			});

		});

		// Adds the reddit link to the table.
		resourceTD.append("<br>")
		resourceTD.append(redditLink)

	// ------End Reddit----------------------------------------------------------------

	// ------Stack Overflow----------------------------------------------------------------

		// The varriable for the Stack Overflow Link.
		var stackLink = $("<a>")
		stackLink.text("StackOverflow")

		// This is the code that will make the modal appear when you click the link.
		stackLink.attr("data-toggle", "modal")
		stackLink.attr("data-target", ".bs-example-modal-lg")

		// Adds a click function for the Stack Overflow link.
		stackLink.click(function() {

			// Emptys the modal body.
			$("#modalbody").empty();

			// Changes the title on the modal.
			$("#myModalLabel").html("Additional Resources - Stack Overflow")

			// Removes the '.' from the function/method name before searching. The '.' would mess with the API call url and prevent it from working.
			var term = childSnapshot.val().functionName
			term = term.replace(/[.]/g, '')

			// Search url of tagged posts name and language.
			// var stackURL = 'http://api.stackexchange.com/2.2/questions?order=desc&sort=votes&tagged=' + term +'+' + childSnapshot.val().language + '&site=stackoverflow';

			// Search url with just the name of the method.
			// var stackURL = 'http://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=' + term + '&site=stackoverflow';

			// The url for the Stack Overflow API call. Searches the name of the function/method and the language for more specific results. 
			var stackURL = 'http://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=' + term + '+' + childSnapshot.val().language + '&site=stackoverflow';

			// The Stack Overflow API call. 
			$.ajax({url: stackURL, method: 'GET'}).done(function(response) {

				// For testing.
				console.log("-----Stack Overflow API call-----");
				console.log(stackURL);
				console.log(response);
		
				// This code makes links out of the first 5 results from Stack Overflow.
				for ( x = 0; x < 5; x++ ) {
					var linky = $("<a>")
					linky.text(response.items[x].title)
					linky.attr("href", response.items[x].link)
					linky.attr("target", "_blank")
					$("#modalbody").append( linky );
					$("#modalbody").append( "<br>" );
				}

			});

		});

		// Adds the Stack Overflow link to the table.
		resourceTD.append("<br>")
		resourceTD.append(stackLink)

	// ------End Stack Overflow----------------------------------------------------------

	// Creates a <td> for the current date and adds it.
	var dateTD = $("<td>")
	dateTD.append(childSnapshot.val().date)

	// Adds all of the individual <td>s we created to the <tr>.

//zintis new appends
	tableEntry.append(tableButtons)
	tableEntry.append(ratingTD)
//zintis	
	tableEntry.append(nameTD)
	tableEntry.append(languageTD)
	tableEntry.append(descriptionTD)
	tableEntry.append(syntaxTD)
	tableEntry.append(resourceTD)
	tableEntry.append(dateTD)
	
	// Adds the <tr> (table row) to the table. FINALLY!
	// $("#theTable").append(tableEntry)
	$("#tbody").append(tableEntry)

// Error handling
}, function(errorObject){

		console.log("Errors handled: " + errorObject.code);

});

// This is the code that makes the DataTable work... DEFINITELY not supposed to be using a time out but I have no idea how to make the function run after the data is loaded.
var lel = function() {
	$(document).ready(function(){
	    $('#theTable').DataTable();
	});
}

setTimeout(lel, 500)

//old zintis code

// the upvote function

		// $(document.body).on('click', '.upvote', function() {

		// 	var identifier = $(this).data('name');//this pulls the firebase key from the data-name of the object

		// 	var identifier = "https://api-project.firebaseio.com/" + identifier + "/rating";//this puts it in the appropriate spot in 

		// 		console.log(identifier);//this returns the correct url to get to the object in question

		// 	var ref = new Firebase(identifier);//I think this calls up the data, according to the key provided
			
		// 		console.log(ref);//this returns the firebase object

		// 		console.log(ref.identifier); //this returns "undefined"

		// 	ref.update({rating: 66});//but this line does not seem to overwrite the "rating" value

		// 	return false;
		// });

//the downvote function
		// $(document.body).on('click', '.downvote', function() {

		// 	var identifier = $(this).data('name');

		// 	console.log(identifier);

		// 	$(this).attr('visibility', 'hidden');
		// 	$(this).children('span').attr('visibility', 'hidden');


		// 	return false;
		// });



//zintis downvote button jquery - passes the button's data-name into a var, uses var to run rating change function 

$(document.body).on('click', '.downvote', function(){
//gets the key
	var identifier = $(this).data('name');
//sets the increment
	var tick = -1;
//makes the key into a table location
	var location = $("#" + identifier + "tabledata");
//references location, if upvoted already doubles the tick
	if (location.data('color') == 'green'){
		tick = -2; 
		location.attr('data-color', "red");
		ratingchange(identifier, tick);
	}else if (location.data('color') == 'red'){
		tick = 0;
		ratingchange(identifier, tick);
	}

//sets a var so change the color
	color = "red";
//checks for the key's presence in the array
	// if (arraypush(identifier, 1)<0){

	console.log(identifier + tick);
//changes the rating
	

	return false;
	// }

});



//zintis upvote button jquery - passes the button's data-name into a var, uses var to run rating change function 

$(document.body).on('click', '.upvote', function() {
//gets the key
	var identifier = $(this).data('name');
//sets the increment
	var tick = 1;
//makes the key into a table location
	var location = $("#" + identifier + "tabledata");
//references location, if upvoted already doubles the tick
	if (location.data('color') == 'red'){
		tick = 2; 
		location.attr('data-color', "green");
	}else if (location.data('color') == 'green'){
		tick = 0;
	}
//sets a var so change the color
	color = "green";
//checks for the key's presence in the array
	// if (arraypush(identifier, 0)<0){

		console.log(identifier + tick);
//changes the rating
	ratingchange(identifier, tick);

	return false;
	// }
	
});




//zintis firebase updater - when the firebase rating is changed, this empties and updates the <td> rating

tableData.on("child_changed", function(snapshot){

		var identifier = snapshot.key();

		console.log("identifier: " + identifier)

		$("#" + identifier + 'tabledata').empty();
		$("#" + identifier + 'tabledata').append(snapshot.val().rating);
		$("#" + identifier + 'tabledata').attr('style', "color:" + color + ";");


	}, function (errorObject){

		console.log("The read failed: " + errorObject.code);
});




//zintis new vote function - this function is passed the key and +1 or -1. it then changes the value in the firebase 

function ratingchange(identifier, x) {

	var ref = new Firebase("https://api-project.firebaseio.com/");

	var usersRef = ref.child(identifier);

	console.log("userref rating" + usersRef.rating);

	var ratingHolder = $('#' + identifier + 'tabledata').html();

	console.log(ratingHolder);

	ratingHolder = parseInt(ratingHolder, 10) + x;

	// console.log(ratingHolder);
	// console.log(ratingHolder);
	usersRef.update({
		rating:ratingHolder
	});

}








//zintis arraypush to keep track of already clicked buttons

// function arraypush(x, y){

// //check array for tag
// 	var index = zintisArray.indexOf(x);
// 		console.log(zintisArray.indexOf(x));
// //push it in if not there
// 	if (index<0){zintisArray.push(x)}
// 		console.log(zintisArray);

// 	console.log(x);
// 	console.log(y);

// 	console.log(zintisArray);
	
// 	return index;

// }

