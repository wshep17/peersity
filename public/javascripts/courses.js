function autocomplete(inp, arr) {
			/*the autocomplete function takes two arguments,
			the text field element and an array of possible autocompleted values:*/
			var currentFocus;
			/*execute a function when someone writes in the text field:*/
			inp.addEventListener("input", function(e) {
			var a, b, i, val = this.value;
			/*close any already open lists of autocompleted values*/
			closeAllLists();
			if (!val) { return false;}
			currentFocus = -1;
			/*create a DIV element that will contain the items (values):*/
			a = document.createElement("DIV");
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items");
			/*append the DIV element as a child of the autocomplete container:*/
			this.parentNode.appendChild(a);
			/*for each item in the array...*/
			for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			/*create a DIV element for each matching element:*/
			b = document.createElement("DIV");
			/*make the matching letters bold:*/
			b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
			b.innerHTML += arr[i].substr(val.length);
			/*insert a input field that will hold the current array item's value:*/
			b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
			/*execute a function when someone clicks on the item value (DIV element):*/
			b.addEventListener("click", function(e) {
			/*insert the value for the autocomplete text field:*/
			inp.value = this.getElementsByTagName("input")[0].value;
			/*close the list of autocompleted values,
			(or any other open lists of autocompleted values:*/
			closeAllLists();
			});
			a.appendChild(b);
			}
			}
			});
			/*execute a function presses a key on the keyboard:*/
			inp.addEventListener("keydown", function(e) {
			var x = document.getElementById(this.id + "autocomplete-list");
			if (x) x = x.getElementsByTagName("div");
			if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
			} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
			} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
			/*and simulate a click on the "active" item:*/
			if (x) x[currentFocus].click();
			}
			}
			});
			function addActive(x) {
			/*a function to classify an item as "active":*/
			if (!x) return false;
			/*start by removing the "active" class on all items:*/
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = (x.length - 1);
			/*add class "autocomplete-active":*/
			x[currentFocus].classList.add("autocomplete-active");
			}
			function removeActive(x) {
			/*a function to remove the "active" class from all autocomplete items:*/
			for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
			}
			}
			function closeAllLists(elmnt) {
			/*close all autocomplete lists in the document,
			except the one passed as an argument:*/
			var x = document.getElementsByClassName("autocomplete-items");
			for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
			x[i].parentNode.removeChild(x[i]);
			}
			}
			}
			/*execute a function when someone clicks in the document:*/
			document.addEventListener("click", function (e) {
			closeAllLists(e.target);
			});
			}
			/*An array containing all the country names in the world:*/
			var courses	= ["CS 1100","CS 1171","CS 1301","CS 1315","CS 1316","CS 1322","CS 1331","CS 1332","CS 1371","CS 1372","CS 1801","CS 1802","CS 1803","CS 1804","CS 1805","CS 2050","CS 2051","CS 2110","CS 2200","CS 2261","CS 2316","CS 2335","CS 2340","CS 2345","CS 2600","CS 2698","CS 2699","CS 2701","CS 2801","CS 2802","CS 2803","CS 2804","CS 2805","CS 3101","CS 3210","CS 3220","CS 3240","CS 3251","CS 3300","CS 3311","CS 3312","CS 4911","CS 3451","CS 3511","CS 3510","CS 3600","CS 3630","CS 3651","CS 3743","CS 3750","CS 3790","CS 3801","CS 3802","CS 3803","CS 3804","CS 3805","CS 4001","CS 4002","CS 4005","CS 4010","CS 4052","CS 4057","CS 4210","CS 4220","CS 4233","CS 7110","CS 4235","CS 6035","CS 4237","CS 4240","CS 4245","CS 4251","CS 4255","CS 4260","CS 4261","CS 4270","CS 4280","CS 4290","CS 6290","CS 4320","CS 4330","CS 4342","CS 4365","CS 6365","CS 4392","CS 4400","CS 6402","CS 4420","CS 6422","CS 4432","CS 4440","CS 4452","CS 4455","CS 6457","CS 4460","CS 7450","CS 4464","CS 6465","CS 4470","CS 4472","CS 6470","CS 4475","CS 4476","CS 4495","CS 6476","CS 4480","CS 4496","CS 4510","CS 4520","CS 7520","CS 4530","CS 7530","CS 4540","CS 6550","CS 4550","CS 4560","CS 4590","CS 4605","CS 4611","CS 4613","CS 4615","CS 4616","CS 4622","CS 7620","CS 4625","CS 4632","CS 4635","CS 4641","CS 4646","CS 4649","CS 4650","CS 7650","CS 4660","CS 4665","CS 4670","CS 4675","CS 6675","CS 4685","CS 4690","CS 4698","CS 4699","CS 4710","CS 4725","CS 6725","CS 4726","CS 6726","CS 4731","CS 4741","CS 4742","CS 4745","CS 4752","CS 4770","CS 4791","CS 4792","CS 4793","CS 4801","CS 4802","CS 4803","CS 4804","CS 4805","CS 4853","CS 4893","CS 4901","CS 4902","CS 4903","CS 4912","CS 4980","CS 6010","CS 6150","CS 6200","CS 6210","CS 6220","CS 6230","CS 6235","CS 6238","CS 6241","CS 6245","CS 6246","CS 6250","CS 6255","CS 6260","CS 6262","CS 6263","CS 6265","CS 6266","CS 6269","CS 6280","CS 6291","CS 6300","CS 6301","CS 6310","CS 6320","CS 6330","CS 6340","CS 6390","CS 6400","CS 6754","CS 6411","CS 6421","CS 6430","CS 6440","CS 6451","CS 6452","CS 6455","CS 6456","CS 6460","CS 6461","CS 6471","CS 6474","CS 6475","CS 6480","CS 6485","CS 6491","CS 6505","CS 6520","CS 6601","CS 6670","CS 6705","CS 6745","CS 6750","CS 6753","CS 6755","CS 6763","CS 6764","CS 6770","CS 6780","CS 6795","CS 6998","CS 6999","CS 7000","CS 7001","CS 7210","CS 7230","CS 7250","CS 7260","CS 7270","CS 7280","CS 7290","CS 7292","CS 7455","CS 7460","CS 7465","CS 7467","CS 7470","CS 7476","CS 7495","CS 7490","CS 7491","CS 7492","CS 7496","CS 7497","CS 7499","CS 7510","CS 7525","CS 7535","CS 7540","CS 7545","CS 7560","CS 7610","CS 7611","CS 7612","CS 7613","CS 7615","CS 7616","CS 7626","CS 7630","CS 7631","CS 7632","CS 7633","CS 7634","CS 7636","CS 7637","CS 7640","CS 7641","CS 7642","CS 7643","CS 7645","CS 7646","CS 7649","CS 7695","CS 7697","CS 7785","CS 7790","CS 7999","CS 8001","CS 8002","CS 8003","CS 8004","CS 8005","CS 8006","CS 8030","CS 8750","CS 8751","CS 8795","CS 8801","CS 8802","CS 8803","CS 8804","CS 8805","CS 8806","CS 8893","CS 8901","CS 8902","CS 8903","CS 8997","CS 8998","CS 8999","CS 9000"];
			/*initiate the autocomplete function on the "myInput" element, and pass along the courses array as possible autocomplete values:*/
			autocomplete(document.getElementById("myInput"), courses);