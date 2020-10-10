$(function()
{
	var err_str = window.dada.i18n.response_error;
	
	var $btn_calc_tsv = $("#calculate_tsv");
	var $btn_calc_esv = $("#calculate_esv");
	//has-error
	var $grp_tid = $("#group_tid");
	var $grp_sid = $("#group_sid");
	var $grp_pid = $("#group_pid");
	
	var $inp_tid = $("#input_tid");
	var $inp_sid = $("#input_sid");
	var $inp_pid = $("#input_pid");
	
	var $cc_img = $("#ccimg");
	var $ccg_img = $("#ccgimg");
	
	var $res_tsv4096 = $("#result_tsv4096");
	var $res_tsv8192 = $("#result_tsv8192");
	var $res_esv4096 = $("#result_esv4096");
	var $res_esv8192 = $("#result_esv8192");
	
	$btn_calc_tsv.click(function()
	{
		$grp_tid.removeClass("has-error");
		$grp_sid.removeClass("has-error");
		
		var tid_val = $.trim($inp_tid.val());
		$inp_tid.val(tid_val);
		var sid_val = $.trim($inp_sid.val());
		$inp_sid.val(sid_val);
		
		// Some minor error checking.
		var has_error = false;
		if (tid_val == ""
		||  /[^0-9]/i.test(tid_val)) {
			$grp_tid.addClass("has-error");
			has_error = true;
		}
		if (sid_val == ""
		||  /[^0-9]/i.test(sid_val)) {
			$grp_sid.addClass("has-error");
			has_error = true;
		}
				
		var tid = parseInt(tid_val, 10);
		var sid = parseInt(sid_val, 10);
		var tsv4096 = (tid ^ sid) >>> 4;
		var tsv8192 = (tid ^ sid) >>> 3;
		
		//Fixed Error Checks
		if (tid < 0 || tid > 65535) {
			$res_tsv4096.text(err_str);
			$res_tsv8192.text(err_str);
			$grp_tid.addClass("has-error");
			has_error = true;
		}
		if (sid < 0 || sid > 65535) {
			$res_tsv4096.text(err_str);
			$res_tsv8192.text(err_str);
			$grp_sid.addClass("has-error");
			has_error = true;
		}
		
		if (has_error == true) {
			$res_tsv4096.text("-");
			$res_tsv8192.text("-");
			$res_tsv8192.css({'color':'default'});
			$inp_tid.css({'border-color':'default'});
			$inp_sid.css({'border-color':'default'});
			return false;
		}
		
		// More minor error checking.
		if (tsv4096 > 4095) {
			$res_tsv4096.text(err_str);
			$res_tsv8192.text(err_str);
			return false;
		}
		if (tsv8192 > 8191) {
			$res_tsv4096.text(err_str);
			$res_tsv8192.text(err_str);
			return false;
		}
		
		$res_tsv4096.text(tsv4096);
		$res_tsv8192.text(tsv8192);
		
		var ccTSV = new Array(0, 1, 2, 3, 6, 7, 8, 9, 9, 10, 11, 12, 18, 19, 20, 21, 25, 26, 27, 28);
		var ccText = " (";
		var ccTable = new Array(0, 0);
		if (ccTSV.includes(tsv8192)) {
			$res_tsv8192.css({'color':'rgb(249, 92, 221)'});
			$inp_tid.css({'border-color':'rgb(249, 92, 221)'});
			$inp_sid.css({'border-color':'rgb(249, 92, 221)'});
			var ccGroup = ccTSV.indexOf(tsv8192);
			var ccGroup2 = ccTSV.lastIndexOf(tsv8192);
			if (ccGroup < 4) {
				ccText += "Male | Any% ♀ | ";
				ccTable[0] = 0;
			} else {
				ccText += "Female | ";
				if (ccGroup > 3 && ccGroup < 8) {
					ccText += "87.5% ♂ | ";
					ccTable[0] = 1;
				} else if (ccGroup > 7 && ccGroup < 12) {
					ccText += "75% ♂ | ";
					ccTable[0] = 2;
				} else if (ccGroup > 11 && ccGroup < 16) {
					ccText += "50% ♂ | ";
					ccTable[0] = 3;
				} else if (ccGroup > 15) {
					ccText += "25% ♂ | ";
					ccTable[0] = 4;
				}
			}
			ccTable[1] = (ccGroup % 4);
			ccText += "Group " + (ccTable[1] + 1) + ")";
			var ccText2 = "";
			if (tsv8192 == 9) {
				tsv8192 += "*";
				$("#tsv9info").removeClass("collapse");
				ccText2 += " (Female | 75% ♂ | Group " + ((ccGroup2 % 4) + 1) + ")"
			} else {
				$("#tsv9info").addClass("collapse");
			}
			var res = tsv8192 + ccText.sup() + ccText2.sub();
			document.getElementById("result_tsv8192").innerHTML = res;
			tableText(ccTable[0], ccTable[1]);
			$cc_img.removeClass("collapse");
		} else {
			$res_tsv8192.css({'color':'default'});
			$inp_tid.css({'border-color':'default'});
			$inp_sid.css({'border-color':'default'});
			$cc_img.addClass("collapse");
		}

		return false;
	});
	
	$btn_calc_esv.click(function()
	{
		$grp_pid.removeClass("has-error");
		
		var pid_val = $.trim($inp_pid.val());
		// Replace full-width characters with regular characters if needed.
		pid_val = fixFullWidth(pid_val);
		$inp_pid.val(pid_val);
		
		// Some minor error checking.
		if (pid_val == "") {
			$grp_pid.addClass("has-error");
			$res_esv.text("-");
			return false;
		}
		
		var pid;
		var is_hex = false;
		// Did the user input hex?
		/*if (pid_val.indexOf("0x") != -1
		||  pid_val.indexOf("#") != -1
		||  /[A-F]{1,8}/i.test(pid_val)) {
			is_hex = true;
		}*/
		// Change in plans -- we now no longer accept decimal numbers
		// because they're stupid!
		is_hex = true;
		
		pid = parseInt(pid_val, is_hex ? 16 : 10);
		// Final error check.
		if (!isNumber(pid)
		||  pid > 0xffffffff) {
			$grp_pid.addClass("has-error");
			$res_esv.text(err_str);
			return false;
		}
		var pid_high = pid >>> 16;
		var pid_low = pid & 0xffff;
		var esv = (pid_low ^ pid_high) >>> 4;
		var esvttf = (pid_low ^ pid_high) >>> 3;
		
		$res_esv.text(esv);
		$res_esvttf.text(esvttf);
		
		return false;
	});
});

$('input[name=gen]', "#settings").keyup(function() { $("#settings input").trigger('change'); });

function isNumber(n)
{
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function fixFullWidth(str)
{
	var full = 'ａｂｃｄｅｆＡＢＣＤＥＦ０１２３４５６７８９';
	var regular = 'abcdefABCDEF0123456789';
	full = full.split("");
	regular = regular.split("");
	for (var a = 0, z = full.length; a < z; ++a) {
		str = str.replace(full[a], regular[a]);
	}
	return str;
}

$(function() {
  $('.spoiler-toggle').click(function(e) {
    e.preventDefault();
    $(this).parent().toggleClass('open');
	
  })
})
function btnToggle() {
  var x = document.getElementById("spt");
  if (x.innerHTML === "Hide") {
    x.innerHTML = "Show";
  } else {
    x.innerHTML = "Hide";
  }
}
function ccimgText(table, column, fill) {
		var canvas = document.getElementById("ccgimg" + column);
     var context = canvas.getContext("2d");
     var imageObj = new Image();
     imageObj.onload = function(){
         context.drawImage(imageObj, 0, 0);
         context.font = "Bold 12pt Calibri";
		 context.fillStyle = "White";
         context.fillText("Shiny Group " + (column + 1), 10, 15);
		 context.font = "10pt Calibri";
		 context.fillStyle = "Black";
		 var Natures = new Array("Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest",
        "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"); //List of Natures
		 var buffers = new Array([0, 7, 0], [2, 0, 0x30], [0, 4, 0x48], [6, 1, 0x90], [0, 7, 0xC8]);
		 for (n = buffers[table][2] + (column * 8) + ((column == 0) ? buffers[table][0] : 0); n <= buffers[table][2] + (column * 8) + (7 - ((column == 3) ? buffers[table][1] : 0)); n++) {
			var y = n % (buffers[table][2] + (column * 8) + ((column == 0) ? ((table == 0) ? 8 : 0) : 0));
			var x = n % (buffers[table][0] + buffers[table][2] + ((table == 0) ? 25 : 0));
			
			if (table == 1 && column == 3 && (y > 2)) {
				context.font = "Italic 10pt Calibri";
				context.fillText("000000" + ((n.toString(16).length == 2) ? n.toString(16) : "0" + n.toString(16)).toUpperCase() + " " + Natures[x % 25], 3, 33 + (y * 17.5));
			} else if (table == 2 && column == 0 && (y < 3)) {
				context.font = "Italic 10pt Calibri";
				context.fillText("000000" + ((n.toString(16).length == 2) ? n.toString(16) : "0" + n.toString(16)).toUpperCase() + " " + Natures[x + 22], 3, 33 + (y * 17.5));
			} else {
				context.font = "10pt Calibri";
				context.fillText("000000" + ((n.toString(16).length == 2) ? n.toString(16) : "0" + n.toString(16)).toUpperCase() + " " + Natures[x - ((table == 2) ? 3 : 0)], 3, 33 + (y * 17.5));
			}
		}
		if (fill) {
			context.beginPath();
      context.rect(0, 0, 111, 162);
      context.fillStyle = '#f95cdd30';
      context.fill();
      context.lineWidth = 0;
      context.strokeStyle = '#f95cdd00';
      context.stroke();
		}
     };
     imageObj.src = "resources/sg.png"; 
	}
function tableText(table, column) {
	var ccGroupText = new Array("Male Lead Any% ♀", "Female Lead 87.5% ♂", "Female Lead 75% ♂", "Female Lead 50% ♂", "Female Lead 25% ♂");
	document.getElementById("ShinyGroup").innerHTML = ccGroupText[table];
	for (i = 0; i < 4; i++) {
		if (i == column) {
			ccimgText(table, i, true);
		} else {
		ccimgText(table, i, false);
		}
	}	
}