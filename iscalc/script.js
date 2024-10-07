$data="";
$bw="";
$time="";
$data_unit="";
$bw_unit="";
function debug($content){
    console.log($content);
}
/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Array (1st value = number, 2nd value = unit).
 */
function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return [bytes,"o"];
    }
    const units = si 
      ? ['o','Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'] 
      : ['o','Kio', 'Mio', 'Gio', 'Tio', 'Pio', 'Eio', 'Zio', 'Yio'];
    let u = 0;
    const r = 10**dp;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 0);
    return [bytes.toFixed(dp),units[u]];
}

/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Array (1st value = number, 2nd value = unit).
 */
function humanBw(bits, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bits) < thresh) {
      return [bits,"b/s"];
    }
    const units = si 
      ? ['b/s','Kb/s', 'Mb/s', 'Gb/s', 'Tb/s'] 
      : ['b/s','Kib/s', 'Mib/s', 'Gib/s', 'Tib/s'];
    let u = 0;
    const r = 10**dp;
    do {
      bits /= thresh;
      ++u;
    } while (Math.round(Math.abs(bits) * r) / r >= thresh && u < units.length - 0);
    return [bits.toFixed(dp),units[u]];
}

function refreshData(){
    $data_unit = document.getElementById('data_unit').value;
    $bw_unit = document.getElementById('bw_unit').value;
    switch($data_unit){
        case 'o':
            $data = document.getElementById('data_val').value * 8;
            break;
        case 'Ko':
            $data = document.getElementById('data_val').value * 8000;
            break;
        case 'Mo':
            $data = document.getElementById('data_val').value * 8000000;
            break;
        case 'Go':
            $data = document.getElementById('data_val').value * 8000000000;
            break;
        case 'To':
            $data = document.getElementById('data_val').value * 8000000000000;
            break;
        case 'Po':
            $data = document.getElementById('data_val').value * 8000000000000000;
            break;
        case 'Eo':
            $data = document.getElementById('data_val').value * 8000000000000000000;
            break;
        case 'Zo':
            $data = document.getElementById('data_val').value * 8000000000000000000000;
            break;
        case 'Yo':
            $data = document.getElementById('data_val').value * 8000000000000000000000000;
            break;
    }
    switch($bw_unit){
        case 'Kb/s':
            $bw = document.getElementById('bw_val').value * 1000;
            break;
        case 'Mb/s':
            $bw = document.getElementById('bw_val').value * 1000000;
            break;
        case 'Gb/s':
            $bw = document.getElementById('bw_val').value * 1000000000;
            break;
        case 'Tb/s':
            $bw = document.getElementById('bw_val').value * 1000000000000;
            break;
        case 'Ko/s':
            $bw = document.getElementById('bw_val').value * 8000;
            break;
        case 'Mo/s':
            $bw = document.getElementById('bw_val').value * 8000000;
            break;
        case 'Go/s':
            $bw = document.getElementById('bw_val').value * 8000000000;
            break;
        case 'To/s':
            $bw = document.getElementById('bw_val').value * 8000000000000;
            break;
    }
    if (document.getElementById('mode_time').checked){
        $time= $data / $bw;
        $minutes = Math.floor($time/60);
        $hours = Math.floor($minutes/60);
        $days = Math.floor($hours/24);
        $hours = Math.floor($hours-($days*24));
        $minutes = Math.floor($minutes-($days*1440)-($hours*60));
        $seconds = Math.floor($time-($days*86400)-($hours*3600)-($minutes*60));
        document.getElementById('days').value=$days;
        document.getElementById('hours').value=$hours;
        document.getElementById('minutes').value=$minutes;
        document.getElementById('seconds').value=$seconds;
    }else if(document.getElementById('mode_data').checked){
        $time = parseInt(document.getElementById('days').value * 86400);
        $time+= parseInt(document.getElementById('hours').value * 3600);
        $time+= parseInt(document.getElementById('minutes').value * 60);
        $time+= parseInt(document.getElementById('seconds').value);//Temps de transfert en secondes
        $data = ($bw * $time)/8;//Quantité de données en octets
        $data_show = humanFileSize($data,true,3)[0];
        $data_unit = humanFileSize($data,true,3)[1];
        if(isFinite($data_show) && !isNaN($data_show)){
            document.getElementById('data_val').value = $data_show;
            document.getElementById('data_unit').value = $data_unit;
        }
    }else if(document.getElementById('mode_bw').checked){
        $time = parseInt(document.getElementById('days').value * 86400);
        $time+= parseInt(document.getElementById('hours').value * 3600);
        $time+= parseInt(document.getElementById('minutes').value * 60);
        $time+= parseInt(document.getElementById('seconds').value);//Temps de transfert en secondes
        $bw = $data / $time;
        $bw_show = humanBw($bw,true,2)[0];
        $bw_unit = humanBw($bw,true,2)[1];
        if(isFinite($bw_show) && !isNaN($bw_show)){
            document.getElementById('bw_val').value = $bw_show;
            document.getElementById('bw_unit').value = $bw_unit;
        }
    }
}
function disableTimeInput(){
    document.querySelectorAll('input.time').forEach(input => input.disabled = true);
    document.querySelectorAll('input.time').forEach(input => input.style.color = 'green');
    document.querySelectorAll('input.time').forEach(input => input.style.fontWeight = 'bold');
    document.querySelectorAll('input.time').forEach(input => input.value = "0");
}
function enableTimeInput(){
    document.querySelectorAll('input.time').forEach(input => input.disabled = false);
    document.querySelectorAll('input.time').forEach(input => input.style.color = 'black');
    document.querySelectorAll('input.time').forEach(input => input.style.fontWeight = 'normal');
    document.querySelectorAll('input.time').forEach(input => input.value = "0");
}
function disableBwInput(){
    document.getElementById('bw_val').disabled = true;
    document.getElementById('bw_val').style.color = 'green';
    document.getElementById('bw_val').style.fontWeight = 'bold';
    document.getElementById('bw_unit').disabled = true;
    document.getElementById('bw_unit').style.color = 'green';
    document.getElementById('bw_unit').style.fontWeight = 'bold';
    document.getElementById('bw_val').value = "0";
    document.getElementById('bw_unit').value = "Kb/s";
}
function enableBwInput(){
    document.getElementById('bw_val').disabled = false;
    document.getElementById('bw_val').style.color = 'black';
    document.getElementById('bw_val').style.fontWeight = 'normal';
    document.getElementById('bw_unit').disabled = false;
    document.getElementById('bw_unit').style.color = 'black';
    document.getElementById('bw_unit').style.fontWeight = 'normal';
    document.getElementById('bw_val').value = "0";
    document.getElementById('bw_unit').value = "Kb/s";
}
function disableDataInput(){
    document.getElementById('data_val').disabled = true;
    document.getElementById('data_val').style.color = 'green';
    document.getElementById('data_val').style.fontWeight = 'bold';
    document.getElementById('data_unit').disabled = true;
    document.getElementById('data_unit').style.color = 'green';
    document.getElementById('data_unit').style.fontWeight = 'bold';
    document.getElementById('data_val').value = "0";
    document.getElementById('data_unit').value ="Ko";
}
function enableDataInput(){
    document.getElementById('data_val').disabled = false;
    document.getElementById('data_val').style.color = 'black';
    document.getElementById('data_val').style.fontWeight = 'normal';
    document.getElementById('data_unit').disabled = false;
    document.getElementById('data_unit').style.color = 'black';
    document.getElementById('data_unit').style.fontWeight = 'normal';
    document.getElementById('data_val').value = "0";
    document.getElementById('data_unit').value ="Ko";
}