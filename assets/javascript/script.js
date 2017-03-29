//TODO: add styling to make things look better.
//TODO: add inputs to the form to allow variable numbers of gifs back, and a rating dropdown.

var topics = ["Daft Punk", "mech", "Iron Man", "Neil deGrasse Tyson", "Bill Nye", "Adam Savage", "Mythbusters", "explosion", "The IT Crowd", "Weapon of Choice"];

$(document).ready(function() {
	var $gifButtonsDiv = $("#gif-buttons");
	var $gifDisplayDiv = $("#gif-display");
	var $gifQueryField = $("#gif-query");
	var $gifSearchForm = $("#gif-search");
	var giphyURL = "https://api.giphy.com/v1/gifs/search?limit=10&rating=pg&api_key=dc6zaTOxFJmzC&q=";

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
	function addButton(text)
	{
		var buttonText = $gifQueryField.val();
		var newButton = $("<button>")
			.addClass("btn btn-info")
			.text(text)
			.data("query", text);
		newButton.click(populateGIFs);
		newButton.appendTo($gifButtonsDiv);
		return newButton;
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
			else
			{
				for(var j = 0; j < r.data.length; j++)
				{
					$("<div>")
						.addClass("clearfix inline-block imageholder")
						.append(
							$("<img>")
								.attr("alt", "gif")
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
			}
		});
	}

	//Initialization of the buttons from the array of topics.
	for(var i = 0; i < topics.length; i++)
	{
		addButton(topics[i]);
	}

	//events that trigger on form submission. Adds button and displays the gifs for that button.
	$gifSearchForm.submit(function(event) {
		event.preventDefault();
		addButton($gifQueryField.val())
			.click();
		$gifQueryField.val("");
	});

});
