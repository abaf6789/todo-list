/*
* @Author: Luka
* @Date:   2017-11-05 11:12:17
* @Last Modified by:   Luka
* @Last Modified time: 2017-11-05 11:14:00
*/
;(function () {
    'use strict';
  var $form_add_task=$('.add-task')
    ,$task_delete_trigger
    ,$task_detail_trigger
    ,task_list=[]
    ,$task_delete
    ,$task_detail
    ,$task_detail=$('.task-detail')
    ,$task_detail_mask=$('.task-detail-mask')
    ;


    init();

    $form_add_task.on('submit',on_add_task_form_submit)
    $task_detail_mask.on('click',hide_task_detail)
    function on_add_task_form_submit(e){
      var new_task={},$input;
      // 禁用默认行为
      e.preventDefault();
      // 获取task的值
      $input=$(this).find('input[name=content]')
      new_task.content=$input.val();
      // 如果新task的值为空 则直接返回，否则继续执行
      if (!new_task.content) return;
      // 存入新task
    if  (add_task(new_task)) {
      // render_task_list();
      $input.val(null);
      }
    }

    function listen_task_detail()
    {
      $task_detail_trigger.on('click',function()
    {
      var $this=$(this);
      var $item=$this.parent().parent();
      var index=$item.data('index');
      show_task_detail(index);
    })
    }

    function show_task_detail(index){
      render_task_detail(index);
      $task_detail.show();
      $task_detail_mask.show();
    }

    function hide_task_detail(){
      $task_detail.hide();
      $task_detail_mask.hide();
    }

    function render_task_detail(index)
    {
      if(index === undefined || !task_list[index])
      return;

      var item=task_list[index];
      var tpl='<div>'+
      '<div class="task-content">'+
      item.content+
      '</div>'  +
      '<div>'+
      '<div class="desc">'  +
      '<textarea value="'+item.desc+'"  ></textarea>'+
      '</div>'+
      '</div>'+
      '<div class="remind">' +
      '<input type="date">'  +
      '<button type="submit">submit</button>'+
      '</div>'
    }

    function listen_task_delete()
    {
      $task_delete_trigger.on('click',function(){
        var $this=$(this);
        var $item=$this.parent().parent();
        var index=$item.data('index');
        var tmp=confirm('确定删除?');
        tmp ? task_delete(index) : null;
      })
    }




    function add_task(new_task)
    {
      // 将新task推入task_list
      task_list.push(new_task);
      // 更新LocalStorage
      refresh_task_list();
      return true;
    }
// 刷新LocalStorage数据并更新渲染模板tpl
    function refresh_task_list()
    {
      store.set('task_list',task_list);
      render_task_list();
    }

    function task_delete(index){
      // 如果没有Index或index不存在则直接返回
      if(index===undefined || !task_list[index]) return;

      delete task_list[index];
      // 更新Localstorage
      refresh_task_list();
    }

    function init() {
      task_list=store.get('task_list') || [];
      if(task_list.length)
        render_task_list();
    }
    // render所有数据
    function render_task_list(){
      var $task_list=$('.task-list');
      $task_list.html('');    //清空
      for(var i=0; i <task_list.length;i++){
        var $task=render_task_item(task_list[i],i);
        $task_list.append($task);
      }
      $task_delete_trigger =$('.action.delete');
      $task_detail_trigger =$('.action.detail');
      listen_task_delete();
      listen_task_detail();
    }

    function render_task_item(data,index){
      if(!data || !index) return;
      var list_item_tpl =
          '<div class="task-item" data-index="'+index+'">'+
          '<span><input type="checkbox"></span> '+
          '<span class="task-content">'+data.content+'</span>'+
          '<span class="fr">'+
          '<span class="action delete"> 删除 </span>'+
          '<span class="action detail"> 详情 </span>'+
          '</span>'+
          '</div>';
          return $(list_item_tpl);
    }
}) ();
