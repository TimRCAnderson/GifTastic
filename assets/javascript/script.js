var topics = ["Daft Punk", "mech", "Iron Man", "Neil deGrasse Tyson", "Bill Nye", "Adam Savage", "Mythbusters", "explosion", "Monty Python", "The IT Crowd"];

$(document).ready(function() {
	var $gifButtonsDiv = $("#gif-buttons");
	var $gifDisplayDiv = $("#gif-display");
	var $gifQueryField = $("#gif-query");
	var giphyURL = "http://api.giphy.com/v1/gifs/search?limit=10&rating=pg&api_key=dc6zaTOxFJmzC&q=";

	console.log($gifQueryField);

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

	for(var i = 0; i < topics.length; i++)
	{
		var initButton = $("<button>")
			.addClass("btn btn-info")
			.text(topics[i])
			.data("query", topics[i]);
		initButton.click(populateGIFs);
		initButton.appendTo($gifButtonsDiv);
	}

	$("#btn-add").click(addButton);
	$gifQueryField.keyup(function (e)
	{
		if(e.which === 13)
		{
			addButton();
		}
	});
});