;(function($){
	'use strict';
	
	$.modalProgress = function(options){
		var options = $.extend({}, ModalProgress.defaults, options || {});
		return new ModalProgress(options);
	};
	
	var ModalProgress = function(options) {
		
		this.options = options;
		this.id = 'modal-progress' + (new Date()).getTime();
		
		var $this = this,
			dom = '<div id="' + this.id + '" class="modal" tabindex="-1" data-backdrop="static" data-keyboard="false" data-attention-animation="false">\
						<div class="modal-body">\
							<div><p class="progress-status"></p></div>\
								<div class="progress">\
									<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 0%">\
										<span class="progress-percent"></span>\
									</div>\
								</div>\
							</p>\
						</div>\
						<div class="modal-footer"></div>\
					<div>';
		
		$("body").append(dom);
		var _modal = $("#" + $this.id),
			i;
		
		// set default count
		$this.setCount(options.count);
		
		// set default Progress bar type
		$this.setBarType(options.barType);
		
		for (i in ModalProgress.buttons) {
			_modal.find('.modal-footer').append(ModalProgress.buttons[i])
		}
		
		// set default status text
		$this.setStatus(options.defaultStatus);
		
		// start button
		_modal.find('.start').bind('click', function(){
			
			$(this).remove();
			_modal.find('.pause').show();
			
			$this.setStatus(options.startStatus);
			
	        if (typeof($this.options.onStart) == 'function'){
	        	$this.options.onStart($this);
	        }
		});
		
        // pause button
		_modal.find('.pause').bind('click', function(){
			
			$(this).hide();
			
			if ($this.options.isPauseLoading) {
				_modal.find('.continue').button('loading');
			} else {
				$this.setBarType('pause');
			}
			
			_modal.find('.continue').show();
			$this.setStatus(options.pauseStatus);
			
			if (typeof($this.options.onPause) == 'function'){
				$this.options.onPause($this);
	        }
		});
        
		// continue button
		_modal.find('.continue').bind('click', function(){
			
			$(this).hide();
			_modal.find('.pause').show();
			
			$this.setBarType('active');
			$this.setStatus(options.startStatus);
			
			if (typeof($this.options.onContinue) == 'function'){
				$this.setBarType('active');
				$this.options.onContinue($this);
	        }
		});
		
		// confirm button
		_modal.find('.confirm').bind('click', function(){
			if (typeof($this.options.onConfirm) == 'function'){
				$this.options.onConfirm($this);
	        }
			$this.destruct();
		});
		
		// cancel button
		_modal.find('.cancel').bind('click', function(){
			
			$this.setCount(0);
			$this.setStatus('');
			
			if (typeof($this.options.onCancel) == 'function'){
				$this.options.onCancel($this);
	        }
			$this.destruct();
		});
		
		_modal.modal('show');
	};
	
	// Modal buttons
	ModalProgress.buttons = {
		cancel	: '<a class="btn btn-default cancel" data-dismiss="modal"><i class="fa fa-times"></i> <span>Cancel</span></a>',
		start	: '<a class="btn green start"><i class="fa fa-caret-right"></i> <span>Start</span></a>',
		pause	: '<a class="btn blue pause" style="display:none;"><i class="fa fa-ban"></i> <span>Pause</span></a>',
		go		: '<a class="btn blue continue" data-loading-text="Loading ..." style="display:none;"><i class="fa fa-refresh"></i> <span>Continue</span></a>',
		confirm : '<a class="btn btn-success confirm" style="display:none;"><i class="fa fa-check"></i> <span>Confirm</span></a>'
	};
	
	// Default settings
	ModalProgress.defaults = {
		isConfirm	: true,
		isPauseLoading : true,
		onStart		: null,
		onPause		: null,
		onContinue	: null,
		onConfirm	: null,
		onCancel	: null,
		count		: 0,
		barType		: 'active',
		defaultStatus : 'Waiting Start',
		startStatus	: 'Loading ...',
		pauseStatus : 'Pause',
		finishStatus: 'Finished!'
	};
	
	ModalProgress.prototype = {
			
		// set total count
		setTotal : function(total) {
			this.total = total;
		},
		
		// get total count
		getTotal : function(){
			return this.total;
		},
		
		// set current count
		setCount : function(count) {
			this.count = count;
		},
		
		// update Progress bar
		refreshBar : function(){
			var percent = calcPercent(this.count, this.total);
			
			// Progress bar
			$("#" + this.id).find('.progress-bar').css('width', percent + '%');
			
			// Percent
			$("#" + this.id).find('.progress-percent').text(percent + ' %');
		},
		
		// get current count
		getCount : function() {
			return this.count;
		},
		
		// set status text
		setStatus : function(status) {
			this.status = status;
			if (typeof(status) == 'string') {
				$("#" + this.id).find('.progress-status').text(status);
			}
		},
		
		// set Progress Bar type
		setBarType : function(type) {
			this.barType = type;
			switch (type) {
				case 'active' :
					$("#" + this.id).find('.progress').addClass('progress-striped active');
					break;
				case 'pause' :
					$("#" + this.id).find('.progress').removeClass('active');
					break;
				case 'finish' :
					$("#" + this.id).find('.progress').removeClass('progress-striped active');
					break;
			}
		},
		
		// finish
		finish : function(){
			$("#" + this.id).find('.confirm').show().siblings().hide();
			
			this.setBarType('finish');
			this.setStatus(this.options.finishStatus);
		},
		
		// destruct Modal
		destruct : function(){
			this.options = ModalProgress.defaults;
			$("#" + this.id).modal('hide').remove();
		},
		
		// finished the pause loading
		pauseLoadingFinish : function(){
			$("#" + this.id).find('.continue').button('reset');
		}
	};
	
})(jQuery);

// calculate the percentage
function calcPercent(count, total) {
	if (!count || !total) {
		return 0;
	}
	
	return parseInt((count / total) * 100);
}
