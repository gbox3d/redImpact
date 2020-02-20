import { Digit2TimeString, TimeString2Digit } from '../../libs/util.mjs';

const _muString = `
<!-- 스캐쥴 인웃 모달 박스 -->
<div class="modal fade" aria-hidden="true">
    <div class="modal-dialog">
        <form class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"> Logic Unit </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                
                

                

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" for class="btn btn-primary">Ok</button>
            </div>
        </form>
    </div>

    <div class="ui-form-list hide">

                <div class="UI_simple" >
                    <div class="form-group">
                        <label > Name </label>
                        <input class="form-control" name="lu_name">
                    </div>

                    <div class='form-group'>
                        <label > looper type </label>
                        <select name="lu_type">
                            <option value="simple" selected >Simple</option>
                            <option value="high-low"  >High Low</option>
                            <option value="looper"  >Looper</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="on_command"> on cmd </label>
                        <input class="form-control" name="on_command">
                    </div>

                    <div class="form-group">
                        <label for="on_time"> 켜짐 시각 (On Time Trigger) </label>
                        <input type="time" class="form-control" name="on_time" >
                    </div>
                    
                </div>
                
                <div class="UI_looper" >
                    <div class="form-group">
                        <label > Name </label>
                        <input class="form-control" name="lu_name">
                    </div>

                    <div class='form-group'>
                        <label > looper type </label>
                        <select name="lu_type">
                            <option value="simple"  >Simple</option>
                            <option value="high-low"  >High Low</option>
                            <option value="looper"  selected>Looper</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="on_command"> on cmd </label>
                        <input class="form-control" name="command">
                    </div>

                    <div class="form-group">
                        <label > 반복 주기(분) </label>
                        <input class="form-control" name="loopDelay" >
                    </div>
                </div>

                <div class="UI_high_low" >
                    <div class="form-group">
                        <label > Name </label>
                        <input class="form-control" name="lu_name">
                    </div>

                    <div class='form-group'>
                        <label > looper type </label>
                        <select name="lu_type">
                            <option value="simple" >Simple</option>
                            <option value="high-low" selected  >High Low</option>
                            <option value="looper">Looper</option>
                            
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="on_command"> on cmd </label>
                        <input class="form-control" name="on_command">
                    </div>

                    <div class="form-group">
                        <label for="off_command"> off cmd </label>
                        <input class="form-control" name="off_command">
                    </div>
                    
                    <div class="form-group">
                        <label for="on_time"> 켜짐 시각 (On Time Trigger) </label>
                        <input type="time" class="form-control" name="on_time" >
                    </div>
                    <div class="form-group">
                        <label for="off_time"> 꺼집 시각 (Off Time Trigger) </label>
                        <input type="time" class="form-control" name="off_time" >
                    </div>
                </div>
    </div>
</div>
`;


function LogicUnitModal({ container }) {

    const _root = document.createElement('div');
    _root.innerHTML = _muString;

    container.appendChild(_root)

    let onHideResolve = null
    let onHideReject = null
    const _modalObj = $(_root.querySelector('.modal'))
    const _form = _root.querySelector('.modal .modal-content')

    const _form_simple = _root.querySelector('.ui-form-list .UI_simple')
    const _form_looper = _root.querySelector('.ui-form-list .UI_looper')
    const _form_highlow = _root.querySelector('.ui-form-list .UI_high_low')

    _form_simple.querySelector('[name=lu_type]').addEventListener('change', evt => {
        console.log(evt.target.value)
        _form.querySelector('.modal-body').removeChild(_form_simple)
        if (evt.target.value === 'high-low') {
            _form.querySelector('.modal-body').appendChild(_form_highlow)
        }
        else if (evt.target.value === 'looper') {
            _form.querySelector('.modal-body').appendChild(_form_looper)
        }
    })
    _form_highlow.querySelector('[name=lu_type]').addEventListener('change', evt => {
        console.log(evt)
        _form.querySelector('.modal-body').removeChild(_form_highlow)
        if (evt.target.value === 'simple') {
            _form.querySelector('.modal-body').appendChild(_form_simple)
        }
        else if (evt.target.value === 'looper') {
            _form.querySelector('.modal-body').appendChild(_form_looper)
        }
    })
    _form_looper.querySelector('[name=lu_type]').addEventListener('change', evt => {
        console.log(evt)
        _form.querySelector('.modal-body').removeChild(_form_looper)
        if (evt.target.value === 'simple') {
            _form.querySelector('.modal-body').appendChild(_form_simple)
        }
        else if (evt.target.value === 'high-low') {
            _form.querySelector('.modal-body').appendChild(_form_highlow)
        }
    })

    this.doModal = () => new Promise((resolve, reject) => {

        onHideResolve = resolve;
        onHideReject = reject;

        $(_root.querySelector('.modal')).modal('show');

    });
    let _item = null;

    _modalObj.on('hidden.bs.modal', evt => {
        // resolve(_item)
        // console.log(evt)
        onHideResolve(_item)
    });

    _modalObj.on('show.bs.modal', evt => {

        _form.querySelector('.modal-body').appendChild(_form_simple)
        _item = null

        // _form.on_command.value = `echo "turn on"`
        // _form.off_command.value = `echo "turn off"`
        // _form.on_time.value = Digit2TimeString("0700");
        // _form.off_time.value = Digit2TimeString("1800");
        //_form.lu_name.value = ""
        //_form.lu_type.value = "simple"

        // console.log('show modal');

    });

    _modalObj.on("submit", evt => {
        evt.preventDefault();

        switch (evt.target.lu_type.value) {
            case 'simple':

                _item = {
                    name: evt.target.lu_name.value,
                    type: evt.target.lu_type.value,
                    timeTrigger: TimeString2Digit(evt.target.on_time.value),
                    // off_time: TimeString2Digit(evt.target.off_time.value),
                    command: evt.target.on_command.value,
                    // off_command: evt.target.off_command.value
                }
                break;
            case 'looper':
                _item = {
                    name: evt.target.lu_name.value,
                    type: evt.target.lu_type.value,
                    loopDelay: evt.target.loopDelay.value,
                    // off_time: TimeString2Digit(evt.target.off_time.value),
                    command: evt.target.command.value,
                    // off_command: evt.target.off_command.value
                }
                break;

            case 'high-low':
                _item = {
                    name: evt.target.lu_name.value,
                    type: evt.target.lu_type.value,
                    on_time: TimeString2Digit(evt.target.on_time.value),
                    off_time: TimeString2Digit(evt.target.off_time.value),
                    on_command: evt.target.on_command.value,
                    off_command: evt.target.off_command.value
                }
                break;
        }

        
        _modalObj.modal('hide')
    });


}

export { LogicUnitModal }



