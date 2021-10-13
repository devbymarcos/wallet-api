<?php $render('header');?>
    <article class="header__section">
            <div class="header__title">
                <h4>Perfil</h4>
             </div>
                
            <hr>
        </article>
    <section class="app__container">
        <form class="app_form" action="<?=url('/user/save')?>" method="post" enctype="multipart/form-data">
        <div class="capa_perfil">
            <?php if($user->photo != "default"):?>
                <img class='rounded perfil-img' data-cover="cover-img" src="<?=image($user->photo , 200)?>">
            <?php else:?>
                <img  class='rounded perfil-img' data-cover="cover-img" src="<?=image("default/user.png", 200)?>">
            <?php endif;?>
            <div class="upload_img_perfil">
                <label class="icon-normalize" for="user_perfil"><i class="fas fa-camera-retro"></i></label>
            </div>
        </div>
        
    
        <!-- ACTION SPOOFING-->
        <input type="hidden" name="action" value="update"/>
        <input type="hidden" name="user_id" value="<?=$user->id?>"/>

        <div class="ds-flex flex-column">
            <div class="input-group_g2">
                <label>Nome</label>
                <input  type="text" class="input-control" name="first_name" value="<?=$user->first_name?>">
            </div>
            <div class="input-group_g2">
                <label>Sobrenome</label>
                <input  type="text" class="input-control" name="last_name" value="<?=$user->last_name?>">
            </div>
        </div>

        <div class="input-group">
            <label>Gênero:</label>
            <select class="input-control" name="genre">
                <?php
                $status = $user->genre;
                $select = function ($value) use ($status) {
                    return ($status == $value ? "selected" : "");
                };
                ?>
                <option <?= $select("male"); ?> value="male">Masculino</option>
                <option <?= $select("female"); ?> value="female">femenino</option>
            </select>
        </div>
        <div class="input-group">
            
            <input id="user_perfil" type="file" class="input-control" 
                data-cover="preview" 
                name="file" 
                placeholder="Imagem de perfil"
                onchange="previewImage()">
            <input type="hidden" name="file_dir" value="<?=$user->photo?>">
        </div>
        
        <div class="ds-flex flex-column">
            <div class="input-group_g2">
                <label>Nascimento</label>
                <input  type="text" class="input-control mask-date " name="datebirth" value="<?=date_fmt($user->datebirth)?>">
            </div>
            <div class="input-group_g2">
                <label>Documento</label>
                <input  type="text" class="input-control mask-doc" name="document" value="<?=$user->document?>">
            </div>
        </div>
        <div class="ds-flex flex-column">
            <div class="input-group_g2">
                <label>Email</label>
                <input  type="email" class="input-control" name="email" value="<?=$user->email?>">
            </div>
            <div class="input-group_g2">
                <label>Senha</label>
                <input  type="password" class="input-control" name="passwd">
            </div>
        </div>
       
        <button class=" btn btn--green">Atualizar</button>
        

    </form>
</section>


<?php $render('footer');?>
