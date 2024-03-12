<?php
    /// заполните следующие две строки своими данными
    $data = json_decode($_POST['data'], true); // получаем данные из тела запроса
    $clientId = 1307; 
    $salt = "f9449217823913db113fa8a"; // соль запроса, Компания -> Интеграция
    $signSource = '';
    $params = [
        'client_id' => $clientId,
        'action' => 'worker_create',
        'email' => $data['email'],
        "password" => 'epaDaaqe196Y!',
        "first_name" => "testapi",
        "last_name" => "testapi",
        // "middle_name" => "45454545",
        "phone" => "89999999998",
        "specialization" => 8, # 8 - WED master
        "country" => "RU",
        "send_message" => 1,
        "language" => "ru"
    ];

    ksort($params);
    foreach ($params as $key => $value) {
        $signSource .= $key . ':' . $value . ';';
    }
    $signSource .= $salt;
    $sign = sha1($signSource);
    $payload = json_encode(array_merge($params, ['signature' => $sign]));
    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, "https://demo-api.solar-staff.com/v1/workers");
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;

?>