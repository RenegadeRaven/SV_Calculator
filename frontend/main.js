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
	
	var $res_tsv = $("#result_tsv");
	var $res_tsvttf = $("#result_tsvttf");
	var $res_esv = $("#result_esv");
	var $res_esvttf = $("#result_esvttf");
	
	
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
		
		if (has_error == true) {
			$res_tsv.text("-");
			$res_tsvttf.text("-");
			return false;
		}
		
		var tid = parseInt(tid_val, 10);
		var sid = parseInt(sid_val, 10);
		var tsv = (tid ^ sid) >>> 4;
		var tsvttf = (tid ^ sid) >>> 3;
		
		// More minor error checking.
		if (tsv > 4096) {
			$res_tsv.text(err_str);
			return false;
		}
		if (tsvttf > 8192) {
			$res_tsv.text(err_str);
			return false;
		}
		
		$res_tsv.text(tsv);
		$res_tsvttf.text(tsvttf);
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