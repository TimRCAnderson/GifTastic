//TODO: put inputs into a form.
//TODO: rework addButton to take a string argument so that it can be used in initialization as well, thereby reducing the amount of code needed.

var topics = ["Daft Punk", "mech", "Iron Man", "Neil deGrasse Tyson", "Bill Nye", "Adam Savage", "Mythbusters", "explosion", "Monty Python", "The IT Crowd"];

$(document).ready(function() {
	var $gifButtonsDiv = $("#gif-buttons");
	var $gifDisplayDiv = $("#gif-display");
	var $gifQueryField = $("#gif-query");
	var giphyURL = "https://api.giphy.com/v1/gifs/search?limit=10&rating=pg&api_key=dc6zaTOxFJmzC&q=";

	console.log($gifQueryField);

	//function that swaps the still and active images from the jquery data object.
	function stillToggle()
	{
		var $this = $(this);
		if($this.data("isStill"))
		{
			$this.attr("src", $this.data("gif"))
				.data("isStill", false);
		}
		else
		{
			$this.attr("src", $this.data("still"))
				.data("isStill", true);
		}
	}

	//create a button, add formatting, reset the input field, append the button, give it a function for its click event, and then trigger that click event.
	function addButton()
	{
		var buttonText = $gifQueryField.val();
		$gifQueryField.val("");
		var newButton = $("<button>")
			.addClass("btn btn-info")
			.text(buttonText)
			.data("query", buttonText);
		newButton.click(populateGIFs);
		newButton.appendTo($gifButtonsDiv);
		newButton.click();
	}

	//function called by gif buttons. Clears the gifs that are displayed and performs an ajax call using the Giphy API. If the API doesn't bring back any gifs, the button gets removed. Otherwise, up to 10 gifs are displayed.
	function populateGIFs()
	{
		$gifDisplayDiv.empty();
		var $this = $(this);

		$.ajax({
			url: (giphyURL + $this.data("query")),
			method: "GET"
		}).done(function(r) {
			if(r.data.length === 0)
			{
				$this.remove();
			}
			for(var j = 0; j < r.data.length; j++)
			{
				$("<div>")
					.addClass("clearfix inline-block")
					.append(
						$("<img>").attr("alt", "gif")
							.attr("src", r.data[j].images.fixed_height_still.url)
							.data({
								still: r.data[j].images.fixed_height_still.url,
								gif: r.data[j].images.fixed_height.url,
								isStill: true})
							.click(stillToggle)
					)
					.append($("<div>")
						.text(r.data[j].rating)
					)
					.appendTo($gifDisplayDiv);
			}
		});
	}

	//Initialization of the buttons from the array of topics.
	for(var i = 0; i < topics.length; i++)
	{
		var initButton = $("<button>")
			.addClass("btn btn-info")
			.text(topics[i])
			.data("query", topics[i]);
		initButton.click(populateGIFs);
		initButton.appendTo($gifButtonsDiv);
	}

	//Puts the addButton function on the search field's button.
	$("#btn-add").click(addButton);
	//I was unclear that forms had different behavior at the time of writing this, so I had to map a keyup event for the enter key on the search input element, which calls the addButton function too.
	$gifQueryField.keyup(function (e)
	{
		if(e.which === 13)
		{
			addButton();
		}
	});
});
