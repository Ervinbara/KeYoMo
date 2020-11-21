import React from 'react';

const HomePage = (props) => {
    return ( 
    <div className="background">
        <h2 className="home_text">Gérer vos clients en toute simplicité 😄</h2>
        <div className="font">
            <div className="first_font">
                <i class="fas fa-user-check"></i>
                <p>Créer un compte 😉</p> 
            </div>
            <div className="between_1">
                <i class="fas fa-long-arrow-alt-right"></i>
            </div>
            <div className="second_font">
                <i class="fas fa-sign-in-alt"></i>
                <p>Connectez-vous 😲</p>  
            </div>
            <div className="between_2">
                <i class="fas fa-long-arrow-alt-right"></i>
            </div>
            <div className="third_font">
                <i class="fas fa-business-time"></i>
                <p>Make your money 💸😏💸</p>
            </div>
        </div>
    </div>
    );
}
 
export default HomePage;