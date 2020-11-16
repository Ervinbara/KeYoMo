<?php

namespace App\Doctrine;

use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    private $security;
    
    //Création dune variable pour chécké si c'est l'admin
    private $auth;


    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->auth = $checker;
        $this->security = $security;
    }

    private function addWhere(QueryBuilder $queryBuilder,string $ressourceClass){
        //Récup de l'user courant 
        $user = $this->security->getUser();

        //Si on dmd des invoices ou des customers alors on agi sur la rqt pr qu'elle tienne compte de l'user co
        if(( $ressourceClass === Customer::class || $ressourceClass === Invoice::class )
        && !$this->auth->isGranted('ROLE_ADMIN') && $user instanceof User){
            $rootAlias = $queryBuilder->getRootAliases()[0];
            
            if($ressourceClass === Customer::class){
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } else if ($ressourceClass === Invoice::class){
                $queryBuilder->join("$rootAlias.customer", "c") //Join permet d'accéder au ressousrce liée 
                             ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);
            
            //dd($queryBuilder);
        }
    }


    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator,
    string $ressourceClass, ?string $operationName = null )
    {   
        $this->addWhere($queryBuilder,$ressourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator,
    string $ressourceClass, array $identifiers, string $operationName = null, array $context = []): void
    {
        $this->addWhere($queryBuilder,$ressourceClass);

    }

}