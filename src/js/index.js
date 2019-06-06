//Tabs

let tab = function () {
	let tabNav = document.querySelectorAll('.panel-tabs__item'),
		tabContent = document.querySelectorAll('.panel__item'),
		tabName;
 
	tabNav.forEach(item => {
		item.addEventListener('click', selectTabNav)
	});
 
	function selectTabNav() {
		tabNav.forEach(item => {
			item.classList.remove('is-active');
		});
		this.classList.add('is-active');
		tabName = this.getAttribute('data-tab-name');
		selectTabContent(tabName);
	}
 
	function selectTabContent(tabName) {
		tabContent.forEach(item => {
			item.classList.contains(tabName) ? item.classList.add('is-active') : item.classList.remove('is-active');
		})
	}
 
 };
 
 
 tab();
 
 //Cities
 
 
 $.ajax({
	dataType: "json",
	url: '/data.json',      
	success: function(result){
 
	   function displayCities() {
		  var data = JSON.stringify(result); 
		  data = JSON.parse(data);
 
		  let cities = [];
		  var cityBlock;
 
		  for (var i in data.features) {
			 var city = data.features[i].city;
			 if (cities.includes(city)) {
 
			 } else {
				 cities.push(city);
 
				 var country = data.features[i].countryId;
 
				 cityBlock = '';
				 cityBlock += "<button class='panel__open'><span>" + data.features[i].city + "</span><div class='panel__arrow'></div></button>";
			  
				 var div = document.createElement("div");
				 div.className = 'panel__block';
				 div.id = 'city-' + data.features[i].cityId + '';
				 div.innerHTML = cityBlock;
 
				 document.getElementById('tab-' + country + '').appendChild(div);
			 }
		  }
 
		  var output;
	 
		  for (var i in data.features) {
			 var city = data.features[i].cityId;
 
			 output = '';
			 output += "<div class='panel__office-name'>Офис <span>" + data.features[i].officeName + "</span></div>";
			 output += "<span class='panel__full-name'>" + data.features[i].fullName + "</span>";
			 output += "<div class='panel__phones'>";
			 output += "<a href='tel:" + data.features[i].phone1 + "' class='panel__phone1'>" + data.features[i].phone1 + "</a>";
			 output += "<a href='tel:" + data.features[i].phone2 + "' class='panel__phone2'>" + data.features[i].phone2 + "</a>";
			 output += "</div>";
			 output += "<span class='panel__email'>" + data.features[i].mail + "</span>";
 
			 var div = document.createElement("div");
			 div.className = 'panel__info';
			 div.setAttribute('data-index',  i);
			 div.setAttribute('data-coord', '[' + data.features[i].geometry.coordinates + ']');
			 div.setAttribute('data-countryid', data.features[i].countryId);
			 div.setAttribute('data-officeName', data.features[i].officeName);
			 div.setAttribute('data-fullName', data.features[i].fullName);
			 div.setAttribute('data-phone1', data.features[i].phone1);
			 div.setAttribute('data-phone2', data.features[i].phone2);
			 div.setAttribute('data-mail', data.features[i].mail);
			 div.setAttribute('data-yandex-x', data.features[i].geometry.coordinates[0]);
			 div.setAttribute('data-yandex-y', data.features[i].geometry.coordinates[1]);
			 div.innerHTML = output;
 
			 document.getElementById('city-' + city + '').appendChild(div);
		  }
 
		  
 
		  //Accordion
 
		  var acc = document.querySelectorAll(".panel__open");
		  var i;
		  
 
		  for (i = 0; i < acc.length; i++) {
			 acc[i].addEventListener("click", function() {
				 this.parentElement.classList.toggle("active");
			 });
		  }
	   }
	   
	   displayCities();
	}
 });

 //Map
 
 $(document).ready(function () {
	 if ($("#map").length > 0) {
		 ymaps.ready(function () {
			 var map = new ymaps.Map("map", {
				 center: [55.76, 37.64],
				 zoom: 6,
				 controls: []
			 });
			 var ClusterContent = ymaps.templateLayoutFactory.createClass('<div class="claster" style="color: #fff">$[properties.geoObjects.length]</div>');
			 var clusterIcons = [{
				 href: 'img/circle.png',
				 size: [30, 30],
				 offset: [-15, -15],
			 }];
			 myClusterer = new ymaps.Clusterer({
				 clusterize: true,
				 clusterIcons: clusterIcons,
				 clusterNumbers: [1],
				 zoomMargin: [30],
				 clusterIconContentLayout: ClusterContent
			 });
			 var myBalloonLayout = ymaps.templateLayoutFactory.createClass(
				 '<div class="baloon">' +
				 '<div class="baloon__office-name">Офис <span>$[properties.officeName]</span></div>' +
				 '<div class="baloon__full-name">$[properties.fullName]</div>' +
				 '<div class="baloon__phones"><a href="tel:$[properties.phone1]">$[properties.phone1]</a><a href="tel:$[properties.phone2]">$[properties.phone2]</a></div>' +
				 '<div class="baloon__email">$[properties.mail]</div>' +
				 '</div>'
			 );
			 var Placemark = {};
			 var coord1 = [],
				 coord2 = [],
				 coord3 = [],
				 coord4 = [];

			 $(".panel__info").each(function () {
				 var X = $(this).attr("data-yandex-x");
				 var Y = $(this).attr("data-yandex-y");
 
				 Obj = $(this).attr("data-index");
 
				 Placemark[Obj] = new ymaps.Placemark([X, Y], {
					 officeName: $(this).attr("data-officeName"),
					 fullName: $(this).attr("data-fullName"),
					 phone1: $(this).attr("data-phone1"),
					 phone2: $(this).attr("data-phone2"),
					 mail: $(this).attr("data-mail")
				 }, {
					 iconLayout: 'default#image',
					 iconImageSize: [20, 20],
					 iconImageHref: 'img/circle-min.png',
					 balloonContentLayout: myBalloonLayout,
					 balloonCloseButton: true
				 });
				 myClusterer.add(Placemark[Obj]);

				 var countryId = $(this).attr("data-countryid");

				 if (countryId == 1) {
					coord1.push(X);
					coord2.push(Y);
				 } else {
					coord3.push(X);
					coord4.push(Y);
				 }
			 });

			 function average(arr) {
				var sum = 0;
				for (i = 0; i < arr.length; i++) {
					arr[i] = Number(arr[i]);
					sum += arr[i];
				}
				var result = sum / arr.length;
				return result;
			 }


			 var rusX = average(coord1);
			 var rusY = average(coord2);
			 var belX = average(coord3);
			 var belY = average(coord4);

			$('.panel-tabs__item[data-country-id="1"]').attr('data-coord', '[' + rusX + ', ' + rusY + ']');

			$('.panel-tabs__item[data-country-id="2"]').attr('data-coord', '[' + belX + ', ' + belY + ']');

			 map.geoObjects.add(myClusterer);

 
			 var activeItem = $('.panel__info').attr('data-coord');
			 activeItem = JSON.parse(activeItem);

 
			 $('.panel__info').click(function() {
				 var objj = $(this).attr('data-coord');
				 objj = JSON.parse(objj);
		 
				 map.setCenter(objj, 15, {
					 checkZoomRange: true,
				 });

				 map.balloon.open(objj, '<div class="baloon">' +
				 '<div class="baloon__office-name">Офис <span>' + $(this).attr("data-officename") + '</span></div>' +
				 '<div class="baloon__full-name">' + $(this).attr("data-fullname") + '</div>' +
				 '<div class="baloon__phones"><a href="tel:' + $(this).attr("data-phone1") + '">' + $(this).attr("data-phone1") + '</a><a href="tel:' + $(this).attr("data-phone2") + '">' + $(this).attr("data-phone2") + '</a></div>' +
				 '<div class="baloon__email">' + $(this).attr("data-mail") + '</div>' +
				 '</div>');
			   	
			 });

			 $('.panel-tabs__item').click(function() {
				var objj = $(this).attr('data-coord');
				objj = JSON.parse(objj);
		
				map.setCenter(objj, 5, {
					checkZoomRange: true,
				});
			 });
			 
		 });
		 
	 }
 });