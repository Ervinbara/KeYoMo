<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;


//Fonction qui va permettre de de récup le firstname et lastname dans le Token pour pour l'utiliser en javascript

class JwtCreatedSubscriber{
    public function updateJwtData(JWTCreatedEvent $event)
    { 
        //Récupération de l'user pour avoir son firstname et name
        $user = $event->getUser();

        //Enrichir les datas pour qu'elles contiennent ces données
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }
}