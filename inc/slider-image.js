/**
 * Tribe Image Widget Javascript
 * @author Modern Tribe, Inc.
 * Copyright 2013.
 */
jQuery(document).ready(function($){

	imageSlider = {
		// Call this from the upload button to initiate the upload frame.
		uploader : function( widget_id, widget_id_string) {

			var frame = wp.media({
				title : TribeImageWidget.frame_title,
				multiple : false,
				library : { type : 'image' },
				button : { text : TribeImageWidget.button_title }
			});

			// Handle results from media manager.
			frame.on('close',function( ) {
				var attachments = frame.state().get('selection').toJSON();
				imageSlider.render( widget_id, widget_id_string, attachments[0] );
			});

			frame.open();
			return false;
		},

		// Output Image preview and populate widget form.
		render : function( widget_id, widget_id_string, attachment ) {

			//$("#" + widget_id_string + '_savebtn').attr('disabled',false);
			
			$("#" + widget_id_string + '_imgid').val(attachment.id);
			$("#" + widget_id_string + '_imgurl').val(attachment.url);
			$("#" + widget_id_string + '_imgpreview').attr('src',attachment.url);

			$("#" + widget_id_string + 'fields').slideDown();

			$("#" + widget_id_string + 'attachment_id').val(attachment.id);
			$("#" + widget_id_string + 'imageurl').val(attachment.url);
			$("#" + widget_id_string + 'aspect_ratio').val(attachment.width/attachment.height);
			$("#" + widget_id_string + 'width').val(attachment.width);
			$("#" + widget_id_string + 'height').val(attachment.height);

			$("#" + widget_id_string + 'size').val('full');
			$("#" + widget_id_string + 'custom_size_selector').slideDown();
			imageSlider.toggleSizes( widget_id, widget_id_string );

			imageSlider.updateInputIfEmpty( widget_id_string, 'title', attachment.title );
			imageSlider.updateInputIfEmpty( widget_id_string, 'alt', attachment.alt );
			imageSlider.updateInputIfEmpty( widget_id_string, 'description', attachment.description );
			// attempt to populate 'description' with caption if description is blank.
			imageSlider.updateInputIfEmpty( widget_id_string, 'description', attachment.caption );
		},

		// Update input fields if it is empty
		updateInputIfEmpty : function( widget_id_string, name, value ) {
			var field = $("#" + widget_id_string + name);
			if ( field.val() == '' ) {
				field.val(value);
			}
		},

		// Render html for the image.
		imgHTML : function( attachment ) {
			var img_html = '<img src="' + attachment.url + '" ';
			img_html += 'width="' + attachment.width + '" ';
			img_html += 'height="' + attachment.height + '" ';
			if ( attachment.alt != '' ) {
				img_html += 'alt="' + attachment.alt + '" ';
			}
			img_html += '/>';
			return img_html;
		},

		// Hide or display the WordPress image size fields depending on if 'Custom' is selected.
		toggleSizes : function( widget_id, widget_id_string ) {
			if ( $( '#' + widget_id_string + 'size' ).val() == 'tribe_image_widget_custom' ) {
				$( '#' + widget_id_string + 'custom_size_fields').slideDown();
			} else {
				$( '#' + widget_id_string + 'custom_size_fields').slideUp();
			}
		},

		// Update the image height based on the image width.
		changeImgWidth : function( widget_id, widget_id_string ) {
			var aspectRatio = $("#" + widget_id_string + 'aspect_ratio').val();
			if ( aspectRatio ) {
				var width = $( '#' + widget_id_string + 'width' ).val();
				var height = Math.round( width / aspectRatio );
				$( '#' + widget_id_string + 'height' ).val(height);
				//imageSlider.changeImgSize( widget_id, widget_id_string, width, height );
			}
		},

		// Update the image width based on the image height.
		changeImgHeight : function( widget_id, widget_id_string ) {
			var aspectRatio = $("#" + widget_id_string + 'aspect_ratio').val();
			if ( aspectRatio ) {
				var height = $( '#' + widget_id_string + 'height' ).val();
				var width = Math.round( height * aspectRatio );
				$( '#' + widget_id_string + 'width' ).val(width);
				//imageSlider.changeImgSize( widget_id, widget_id_string, width, height );
			}
		},
		
		saveData : function( slider_id, widget_id_string, attachment ) {
			
			var data = {
				'action': 'saveData',
				'slider_id': slider_id,
				'imgid': $('#featured_slider_'+slider_id+'_imgid').val(),
				'imgurl': $('#featured_slider_'+slider_id+'_imgurl').val(),
			};

			// since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
			$.post(ajaxurl, data, function(response) {
				console.log('Got this response from the server du cul: ' + response);
			});
			//$('#featured_slider_'+slider_id+'_savebtn').attr('disabled',true);
		}
	
	};

});