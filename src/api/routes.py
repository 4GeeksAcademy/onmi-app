"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Notes, Habits,Projects
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy.exc import NoResultFound
from flask_jwt_extended import verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy.exc import NoResultFound
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta, timezone
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv


load_dotenv()  # Carga las variables del archivo .env

sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

## ver la finalidad de los endpoins antes de crearlos 

## GET ALL users a menos que muestre un panel de admin en el front no sera necesario
## Los endpoins que son necesario aclarar esto (los de las rutas)

@api.route('/user', methods=['GET'])
def get_all_users():

    data = db.session.scalars(db.select(User)).all()
    result = list(map(lambda item: item.serialize(),data))
    print(result)
#eliminar print 
    if result == []:
        return jsonify({"msg":"user does not exists"}), 404
#eliminar msg "Hello, this is your GET /user response "
    response_body = {
        "msg": "Hello, this is your GET /user response ",
        "results": result
    }

    return jsonify(response_body), 200

## GET ONE user
@api.route('/user/<int:id>', methods=['GET'])
def get_one_user(id):
    try:
        #eliminar print 
        print(id)
        user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one()
    
        return jsonify({"result":user.serialize()}), 200
    except:
        return jsonify({"msg":"user do not exist"}), 404
    

@api.route('/register', methods=['POST'])
def create_user():
    try:
        request_body = request.json
        email = request_body["email"]
        password = request_body["password"]  
        name = request_body["name"]
        gender = request_body["gender"]

        if not email or not password or not name:
            return jsonify({"msg": "missing data"}), 400 

        # 1. Verificar si el usuario ya existe
        existing_user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
        if existing_user:
            return jsonify({"msg": "User already exists"}), 400

        # 2. Encriptar contraseña
        hashed_password = generate_password_hash(password)

        # 3. Crear nuevo usuario
        new_user = User(
            name=request_body["name"],
            
            email=request_body["email"],
            gender=request_body["gender"],
            password=hashed_password,
            is_active=True,
            role= "USER"
            
        )

        db.session.add(new_user)
        db.session.commit()

        # 4. Generar token JWT
        access_token = create_access_token(identity=email)

        return jsonify({"msg": "User created", "access_token": access_token}), 201

    except Exception as e:
        return jsonify({"msg": "Error creating user", "error": str(e)}), 500

@api.route("/login", methods=["POST"])
def login():
    try:
        #     # OBTIENE INFO CUERPO PETICION
        email = request.json.get("email", None)
        password = request.json.get("password", None)

        # 1 registro de tabla específica
        user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
        if not user:
            return jsonify({"msg": "Bad password or email"}), 401

        # establecer condiciones si el email que me envian desde el front es distinto envia error si no envia el token
        # if email != user.email or check_password_hash(user.password, password):
        #     return jsonify({"msg": "Bad password or email"}), 401
    #     access_token = create_access_token(identity=email)
    #     return jsonify({"access_token":access_token})
    # except NoResultFound:
    #     return jsonify ({"msg": "Bad password or email"}), 401

        if not email or not password:
            return jsonify({"msg": "Bad password or email"}), 401

        # 2. Verificar la contraseña encriptada
        if not password or not check_password_hash(user.password, password):
            return jsonify({"msg": "Bad password or email"}), 401

        # 3. Crear token JWT
        access_token = create_access_token(identity=email)

        return jsonify({"access_token": access_token}), 200

    except Exception as e:
        return jsonify({"msg": "Error logging in", "error": str(e)}), 500
    








    
    # Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.


@api.route("/profile", methods=["GET"])
@jwt_required()
def user_profile():
    try:
        # Obtener el email del usuario autenticado desde el token
        current_user_email = get_jwt_identity()

        # Buscar al usuario en la base de datos
        user = db.session.execute(
            db.select(User).filter_by(email=current_user_email)
        ).scalar_one_or_none()

        # Verificar si el usuario existe
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Devolver los datos del usuario
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "gender": str(user.gender)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route("/verify-token", methods=["GET"])
def verify_token():
    try:
        verify_jwt_in_request()
        identify = get_jwt_identity()
        return jsonify({"valid": True, "user": identify}), 200
    except NoAuthorizationError:
        return jsonify({"valid": False, "message": "Token invalido o no proporcionado"})













@api.route("/notes", methods=["GET"])
@jwt_required()
def call_notes():
    
    current_user = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=current_user)).scalar_one()
    print(user)

    #aplicar logica para mostar profile 
    notes = db.session.execute(db.select(Notes).filter_by(user_id=user.id)).scalars()
    list_notes = [note.serialize() for note in notes]
    #print(list_notes)



    return jsonify({"resul": list_notes}), 200


# @app.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     # Access the identity of the current user with get_jwt_identity
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200







































































# Funcional
@api.route("/habits", methods=["POST"])
@jwt_required()  # Protegemos el endpoint con JWT
def create_habit():
    """Crea un nuevo hábito solo si el usuario está autenticado"""

    try:
        request_body = request.get_json()

        # Obtener el usuario autenticado desde el token
        current_user_email = get_jwt_identity()
        print(current_user_email)
        user = db.session.execute(db.select(User).filter_by(email=current_user_email)).scalar_one_or_none()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Validar que todos los campos obligatorios estén en la solicitud
        required_fields = ["title", "category"]
        if not all(field in request_body for field in required_fields):
            return jsonify({"error": "Todos los campos son obligatorios"}), 400

        # Crear nueva instancia de Habit asignando automáticamente el user_id
        new_habit = Habits(
            name=request_body["title"],
            description=None,
            category=request_body["category"],
            user_id=user.id,  # 🔥 Se asigna automáticamente con el usuario autenticado
            goals_id=None,
            ready=False
        )

        # Guardar en la base de datos
        db.session.add(new_habit)
        db.session.commit()

        return jsonify({
            "msg": "Hábito creado exitosamente",
            "habit": new_habit.serialize()  # Asegúrate de que `Habits` tiene un método `serialize()`
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500




# Funcional
@api.route('/habits', methods=['GET'])
@jwt_required()
def handle_get_habits():
    """Ruta protegida que devuelve los hábitos del usuario autenticado"""

    current_user = get_jwt_identity()  # Obtiene el email o ID del usuario autenticado

    # Buscar el usuario en la base de datos
    user = db.session.execute(db.select(User).filter_by(email=current_user)).scalar_one_or_none()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Filtrar los hábitos del usuario autenticado
    habits = db.session.execute(
        db.select(Habits).filter_by(user_id=user.id)
    ).scalars().all()  # Convertir a lista para evitar problemas con generadores

    if not habits:
        return jsonify({"msg": "No habits found"}), 404

    # Serializar los hábitos
    list_habits = [habit.serialize() for habit in habits]

    return jsonify(list_habits), 200  # Devuelve solo los hábitos del usuario autenticado



@api.route('/habits/<int:id>', methods=['DELETE'])
@jwt_required()  # 🔒 
def delete_habit(id):
    

    try:
        current_user_email = get_jwt_identity()
        user = db.session.execute(db.select(User).filter_by(email=current_user_email)).scalar_one_or_none()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # busca e habito en la base de dats.
        habit = db.session.execute(db.select(Habits).filter_by(id=id)).scalar_one_or_none()

        if not habit:
            return jsonify({"error": "Habit not found"}), 404

        if habit.user_id != user.id:
            return jsonify({"error": "You do not have permission to delete this habit"}), 403

        # Elimina el hbit,
        db.session.delete(habit)
        db.session.commit()

        return jsonify({"msg": "Habit successfully deleted"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@api.route('/habits/<int:id>', methods=['PUT'])
@jwt_required()
def update_habit(id):
    try:
        # Obtener el usuario autenticado
        current_user_email = get_jwt_identity()
        user = db.session.execute(db.select(User).filter_by(email=current_user_email)).scalar_one_or_none()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Buscar el hábito por ID y verificar que pertenece al usuario
        habit = db.session.execute(db.select(Habits).filter_by(id=id, user_id=user.id)).scalar_one_or_none()

        if not habit:
            return jsonify({"error": "Habit not found"}), 404

        # Obtener los datos enviados en la solicitud
        data = request.get_json()
        count = data.get('count', habit.count)
        dates = data.get('dates', habit.dates)

        # Actualizar los campos del hábito
        habit.count = count
        habit.dates = dates

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"message": "Habit updated successfully", "habit": habit.serialize()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@api.route('/user/changepassword', methods=['PUT'])
@jwt_required()
def change_password():
    current_user_email = get_jwt_identity()
    print("current_user_email:", current_user_email)  # Agrega este registro para depurar

    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return jsonify({"msg": "Se requieren las contraseñas actual y nueva"}), 400

    user = User.query.filter_by(email=current_user_email).first()
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if not user.check_password(current_password):
        return jsonify({"msg": "Contraseña actual incorrecta"}), 401

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada exitosamente"}), 200

from flask_jwt_extended import jwt_required, get_jwt_identity




@api.route('/user/me', methods=['GET'])
@jwt_required()
def get_logged_in_user():
    try:
        # Obtén el mail del usuario autenticado desde el token
        current_user_email = get_jwt_identity()
        print(f"email del usuario autenticado: {current_user_email}")

        # Busca al usuario en la base de datos
        user = db.session.execute(db.select(User).filter_by(email=current_user_email)).scalar_one()
        print(f"Usuario recuperado: {user.serialize()}")

        return jsonify(user.serialize()), 200
    except Exception as e:
        # Registrar el error en los logs del servidor
        print(f"Error en /user/me: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    







































































#Crear una nota LISTO
@api.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    body_data = request.json
    print(body_data)

    if body_data is None:
        raise APIException("You need to specify the request body as a json object", status_code=400)
    if 'title' not in body_data:
        raise APIException('You need to specify the title', status_code=400)
    if 'description' not in body_data:
        raise APIException('You need to specify the description', status_code=400)
    
    try:
        current_user = get_jwt_identity()
        user = db.session.execute(db.select(User).filter_by(email=current_user)).scalar_one()
        if user != None:

            new_note = Notes(user_id=user.id, title=body_data["title"], description=body_data["description"], category=body_data["category"])
            db.session.add(new_note)
            db.session.commit()
            print(new_note.serialize())

        response_body = {
            "new_note": new_note.serialize()
        }
        
        return jsonify(response_body), 200
    except Exception as e: 
        #print(e)
        return jsonify({"msg":"Not ok"}), 500
        


 
@api.route('/notes/<int:id>', methods=['PUT'])
@jwt_required()
def update_note(id):

    current_user = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=current_user)).scalar_one()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Buscar la nota con el ID dado
    note = Notes.query.get(id)

    if not note:
        return jsonify({"msg": "Note not found"}), 404

    data = request.json
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')

    if title:
        note.title = title
    if description:
        note.description = description
    if category:
        note.category = category

    db.session.commit()

    return jsonify({"msg": "Note updated successfully", "note": {
        "id": note.id,
        "title": note.title,
        "description": note.description,
        "category": note.category
    }}), 200


#Borrar note usando ID_NOTE LISTO
@api.route('/notes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_note(id):
    #print(id)
    try:
        current_user = get_jwt_identity()
        user = db.session.execute(db.select(User).filter_by(email=current_user)).scalar_one()
        note = db.session.execute(db.select(Notes).filter_by(id=id)).scalar_one()
        #print(note.user_id)
        if user.id == note.user_id:
       
            user_query = note
            print(user_query.serialize())
            db.session.delete(user_query)
            db.session.commit()

            return jsonify({"msg":"Note delete"}), 200
    except:
       
        return jsonify({"msg":"Note does not exist"}), 404
    


@api.route('/reset-password', methods=['POST'])
def send_reset_email():
    try:
        email = request.json.get('email')
        if not email:
            return jsonify({"msg": "Email es requerido"}), 400

        user = db.session.query(User).filter_by(email=email).first()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Genera un token de reseteo
        token = generate_password_hash(email + str(user.id))
        user.reset_token = token
        user.token_expiration = datetime.now(timezone.utc) + timedelta(hours=1)  # Expira en 1 hora
        db.session.commit()

        # Construye el enlace de reseteo
        reset_url = f"{os.getenv('FRONTEND_URL', 'https://jubilant-disco-v6qv6x4v666qfx46j-3000.app.github.dev')}/reset-password/{token}"

        # Construye el mensaje del correo
        message = Mail(
            from_email='onmi.app.help@gmail.com',  # Usa tu correo verificado en SendGrid
            to_emails=email,
            subject='Reset Password',
            html_content=f"""
            <p>Hello,</p>
            <p>Click this link to reset your password:</p>
            <a href="{reset_url}">{reset_url}</a>
            <p>If this wasn't you, ignore this mail.</p>
            """
        )

        # Envía el correo usando SendGrid
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)

        print(f"Email enviado: {response.status_code}")
        return jsonify({"msg": "Email de reseteo enviado"}), 200

    except Exception as e:
        print(f"Error interno: {str(e)}")
        return jsonify({"msg": "Error interno", "error": str(e)}), 500
    except Exception as e:
        print(f"Error interno: {str(e)}")
        return jsonify({"msg": "Error interno", "error": str(e)}), 500
@api.route('/update-password', methods=['POST'])
def update_password():
    try:
        data = request.json
        token = data.get('token')
        new_password = data.get('password')

        if not token or not new_password:
            return jsonify({"msg": "Token y nueva contraseña son requeridos"}), 400

        # Busca el usuario con el token válido y no expirado
        user = db.session.query(User).filter(
            User.reset_token == token,
            User.token_expiration > datetime.now(timezone.utc)
        ).first()

        if not user:
            return jsonify({"msg": "Token inválido o expirado"}), 400

        # Actualiza la contraseña del usuario
        user.set_password(new_password)
        user.reset_token = None  # Limpia el token
        user.token_expiration = None  # Limpia la expiración
        db.session.commit()

        return jsonify({"msg": "Contraseña actualizada exitosamente"}), 200

    except Exception as e:
        print(f"Error interno: {str(e)}")
        return jsonify({"msg": "Error interno", "error": str(e)}), 500
    



@api.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    current_user = get_jwt_identity()  
    print("Usuario autenticado:", current_user)  # Depuración

    user = db.session.execute(db.select(User).filter_by(email=current_user)).scalar_one_or_none()
    data = request.get_json()

    # Verificar si todos los campos están presentes
    required_fields = ["name", "status", "category", "urgency", "date"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Proceder con la creación del proyecto si todos los campos están presentes
    # (por ejemplo, guardar en la base de datos)
    new_project = Projects(
        name=data["name"],
        status=data["status"],
        category=data["category"],
        user_id=user.id,
        Urgency=data["urgency"],
        date=data["date"]
    )
    db.session.add(new_project)
    db.session.commit()

    return jsonify({"message": "Proyecto creado exitosamente"}), 201


@api.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    """Ruta protegida que devuelve los proyectos del usuario autenticado"""

    current_user = get_jwt_identity()  
    print("Usuario autenticado:", current_user)  # Depuración

    user = db.session.execute(db.select(User).filter_by(email=current_user)).scalar_one_or_none()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    projects = db.session.execute(
        db.select(Projects).filter_by(user_id=user.id)
    ).scalars().all()

    print("Proyectos encontrados:", projects)  # Depuración

    if not projects:
        return jsonify({"msg": "No projects found"}), 404

    return jsonify([project.serialize() for project in projects]), 200

@api.route('/projects/<int:id>', methods=['DELETE'])
@jwt_required()  # 🔒 
def delete_projects(id):
    

    try:
        current_user_email = get_jwt_identity()
        user = db.session.execute(db.select(User).filter_by(email=current_user_email)).scalar_one_or_none()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # busca e habito en la base de dats.
        projects = db.session.execute(db.select(Projects).filter_by(id=id)).scalar_one_or_none()

        if not projects:
            return jsonify({"error": "projects not found"}), 404

        if projects.user_id != user.id:
            return jsonify({"error": "You do not have permission to delete this projects"}), 403

        # Elimina el hbit,
        db.session.delete(projects)
        db.session.commit()

        return jsonify({"msg": "projects successfully deleted"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500