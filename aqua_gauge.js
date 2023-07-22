define(['knockout', 'text!./aqua_gauge.html', 'AquaGauge.js'], function(ko, templateMarkup) {

	function Aqua_Gauge(params, componentInfo) {
		var self = this;
		if(params.data) params = params.data;
		self.canvas = componentInfo.element.childNodes[0];
		self.drag = ko.observable(false);


		self.width = ko.handleDefault(params.width, 330);
		self.height = ko.handleDefault(params.height, 330);
		self.minValue = ko.handleDefault(params.minValue, 0);
		self.maxValue =  ko.handleDefault(params.maxValue, 50);
		self.noOfDivisions = ko.handleDefault(params.noOfDivisions, 5);
		self.noOfSubDivisions = ko.handleDefault(params.noOfSubDivisions, 4);
		self.showMinorScaleValue = ko.handleDefault(params.showMinorScaleValue, false);
		self.showMajorScaleValue = ko.handleDefault(params.showMajorScaleValue, true);

		self.value = ko.handleDefault(params.value, self.minValue());
		self.dialTitle = ko.handleDefault(params.dialTitle, '');
		self.dialSubTitle = ko.handleDefault(params.dialSubTitle, '');

		self.rangeSegments = ko.handleDefaultArray(params.rangeSegments,[{ start: ko.utils.unwrapObservable(self.minValue), end: ko.utils.unwrapObservable(self.maxValue), color: 'green' }]);

		self.MDown = function (obj,jEv) {
			var ev = jEv.originalEvent;
			var Pct, x, y;
			x = jEv.offsetX;
			y = jEv.offsetY;
			Pct = Math.atan2((self.height()-y)-(self.height()*0.5), x-(self.width()*0.5));
			Pct = -Pct-(Math.PI*.7);
			if (Pct<0) Pct=Pct+Math.PI*2.0;
			if (Pct>Math.PI*2.0) Pct=Math.PI*2.0;
			Pct=Pct/(Math.PI*2.0);
			Pct=Pct*1.25;
			x = self.minValue() + Pct*(self.maxValue()-self.minValue());
			x = Math.round(x);
			if (x<self.minValue) x=self.minValue();
			if (x>self.maxValue) x=self.maxValue();
			if(self.value.forceValue)
				self.value.forceValue(x);
			else
				self.value(x);
			self.drag(true);
		}

		self.MMove = function (obj,jEv) {
			var ev = jEv.originalEvent;
			var Pct, x, y;
			if (self.drag()) {
				x = jEv.offsetX;
				y = jEv.offsetY;
				Pct = Math.atan2((self.height()-y)-(self.height()*0.5), x-(self.width()*0.5));
				Pct = -Pct-(Math.PI*.7);
				if (Pct<0) Pct=Pct+Math.PI*2.0;
				if (Pct>Math.PI*2.0) Pct=Math.PI*2.0;
				Pct=Pct/(Math.PI*2.0);
				Pct=Pct*1.25;
				x = self.minValue() + Pct*(self.maxValue()-self.minValue());
				x = Math.round(x);
				if (x<self.minValue()) x=self.minValue();
				if (x>self.maxValue()) x=self.maxValue();
				if(self.value.forceValue)
				self.value.forceValue(x);
			else
				self.value(x);
			}
		}

		self.MUp = function (obj,jEv) {
			self.drag(false);
		}


		if(params.noEdit) {
			self.MDown = self.MMove = self.MUp =  function(){};
		}
		//hack to delay drawing until html is bound
		setTimeout(self.init, 500);
/*



		*/
	}

	Aqua_Gauge.prototype.dispose = function() { };

	return {
		viewModel: {createViewModel:function(params, componentInfo) {return new Aqua_Gauge(params, componentInfo)}},
		template: templateMarkup,
		synchronous: true
	};

});