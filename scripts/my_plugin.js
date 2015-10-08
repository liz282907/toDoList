(function($){


	
	$.fn.todo = function(options)
	{
		//待写：当输入为空时震动，可以考虑jquery插件中的effect效果。 已写 done
		//待写：输入框有focus时边框                     done
		//待考虑：事件propagation的问题，特别是在div中双击等问题。
		//待解决：checkAll 的默认选中问题
		//待解决：双击div后光标默认最开始的问题。
		//line 91 和96开始的blur函数与keydown函数，有没有简化编程的方法

		//疑问：该空间内的变量无法访问。line 160


		var $input = $("#main_body>input");
		var $checkbox = $("#item_lists input:checkbox");
		var settings = $.extend({},$.fn.todo.defaults,options);

		//响应回车事件，回车后添加一个list，同时检测文本，如果为空，shake，不为空添加且清空输入框
		$(document).on("keydown","#main_body>input",function(event)
		{
			
			var text = $.trim($input.val());
			if(event.which==13)
			{
				//设置文本输入框限长，将原有数据保存在text中
				var short_words= checkTextLength(text,settings.limits,$input);
				if(short_words)
				{
					var $item_text = $("<label class='with_cbx_item'>"+short_words+"</label>");
					$item_text.attr("title",text)				
					.appendTo("#item_lists")
					.wrap("<div class='user_choice_item'></div>")
					.parent().css(settings.parent_style)
					.end()
					.before("<input type='checkbox' name='item_cbx' />");
					//回车后清空输入框
					$input.val("");
				}

				
			}
		});
		//全选复选框按下
		$("#checkAll input").click(function()
		{
			//很奇怪的部分
			var $checkbox = $("#item_lists input:checkbox");
			$checkbox.prop("checked",this.checked);
			updateBottom();
			//one choice: $checkbox.each(function(){ this.checked = true; });
		});
		//选中单个复选框
		//这边需要绑定
		$("#item_lists").on("click","input:checkbox",function()
		{
			var flag = true;
			$("#item_lists input:checkbox").each(function()
			{
				if(!this.checked) flag=false;
			});
			//设置全选框
			$("#checkAll input").prop("checked",flag);

			updateBottom();

		});
		//hover到每一个item的时候有删除按钮
		$("#item_lists")
		.on("mouseenter",".user_choice_item",function()
		{
			$this = $(this);
			$this.append("<span class='delete_bt'></span>")
			.show()
			.children(".delete_bt").click(function()
			{
				$this.remove();
				updateBottom();
			})
			//$("<span class='delete_bt'></span>").appendTo($(".user_choice_item")).show();
		})
		.on("mouseleave",".user_choice_item",function(){
			$(this).find(".delete_bt").remove();

		})
		.on("dblclick",".user_choice_item",function(event)
		{//双击事件，使得div可以编辑
			$original_input=$(this).find("label.with_cbx_item");
			var original_val = $original_input.text();
			var original_title = $original_input.prop("title");
			//注意这边的单双引号
	//		$original_input.replaceWith("<input type='text' class='with_cbx_dbl' value='"+original_val+"' title='"+original_title+"' />");
	$original_input.replaceWith("<input type='text' class='with_cbx_dbl' title='"+original_title+"' />");
	//注意光标默认在最左边，如果想挪到右边的话，动态加载value，具体来说先focus，然后再val
			$(".user_choice_item").children("input.with_cbx_dbl").focus().val(original_val).blur(function()
			{
				var edit_val = $(this).val();
				var edit_title = $(this).prop("title");
				$(this).replaceWith("<label class='with_cbx_item' title='"+edit_title+"' >"+edit_val+"</label>");
			}).keydown(function(e){
				if(e.which==13)
				{
					var edit_val = $(this).val();
					var edit_title = $(this).prop("title");
					$(this).replaceWith("<label class='with_cbx_item' title='"+edit_title+"' >"+edit_val+"</label>");
				}

			})
			.siblings("span").remove()

		//	.parent().addClass("focus").children("input.with_cbx_dbl").focus().siblings("span").remove();
			
		});

		//底部清除按钮的事件
		$("#bottom .delete_items").click(function()
		{
			$("#item_lists input:checkbox").filter(":checked")
			.parent().remove();
			updateBottom();

		});



	};

	$.fn.todo.defaults = 
	{
		limits:23,
		parent_style:{
			// border:"2px solid #c1c4c5",//加双引号
			background:"white",

		}

	}

	function updateBottom()
	{
		//不全选，
		var $checkbox = $("#item_lists input:checkbox");
		var checked_num = $checkbox.filter(":checked").length;
		if(checked_num>0)
		{
			$("#bottom .delete_items").show()
			.parent().find("label").text(checked_num+" items selected");
		}
		else //一个都不选中
		{
			$("#bottom .delete_items").hide()
			.parent().find("label").text("none is selected");
		}
	}

	function checkTextLength(edit_text,limits,$target)
	{
		if(edit_text==""||edit_text==null)
		{
			         //不明白这边的$input为什么不能访问
			        // $input.effect("shake");
			$("#main_body>input").effect("shake");
			return null;
		}
		var short_text = edit_text;

		if(edit_text.length>=limits)
			short_text = edit_text.substr(0,limits)+"...";
		return short_text;
	}



})(jQuery)


$(function()
{
	var $input = $("#main_body>input");
	/*
	$input.focus(function()
	{
		$(this).addClass("focus");
	}).blur(function()
	{
		$(this).removeClass("focus");
	}).todo();
*/

	$("#main_body>input").todo();

});

/*

//不全选，
			var checked_num = $checkbox.filter(":checked").length;
			if(checked_num>0)
			{
				$("#bottom .delete_items").show()
				.parent().find("label").text(checked_num+" items selected");

			}
			else //一个都不选中
			{
				$("#bottom .delete_items").hide()
				.parent().find("label").text("none is selected");
			}
*/