<?php
    /// заполните следующие две строки своими данными
    $data = json_decode($_POST['data'], true); // получаем данные из тела запроса
    $clientId = 1307; 
    $salt = "f9449217823913db113fa8a"; // соль запроса, Компания -> Интеграция
    $signSource = '';
    $params = [
        'client_id' => $clientId,
        'action' => 'payout',
        'email' => $data['email'],
        #"task_id" : 12345, 
        "merchant_transaction"   => $data['transaction_id'], # ID транзакции, надо протестить на уникальность
        #"card_id" : 55, 
        "currency"  => "RUB",
        "amount"  => $data['amount'],    
        "todo_type"  => 20, # вам достаточно кода 20 "Управление размещением медийной рекламы"
        "todo_attributes"  => $data['site_uri'], # для кода 20 надо указать урлу сайта, где размещена реклама
        "task_title"  => "Размещение рекламы",
        "task_description"  => "Размещение рекламы на сайте", 
    ];

    ksort($params);
    foreach ($params as $key => $value) {
        $signSource .= $key . ':' . $value . ';';
    }
    $signSource .= $salt;
    $sign = sha1($signSource);
    $payload = json_encode(array_merge($params, ['signature' => $sign]));
    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, "https://demo-api.solar-staff.com/v1/payment");
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;

?>