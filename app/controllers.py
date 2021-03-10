import sys
from app import app
from flask import abort, request, render_template, Response, redirect

from .forms import SessionForm
from .models import MessageManager, SessionManager


# ------------ Web Routes ------------ #

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/session-page/', methods=['GET', 'POST'])
def session():
    return render_template('session.html', title='Session')


# ------------ Ajax Routes ------------ #

# DEFINE YOUR API HERE

# Rest of the Ajax Routes #

@app.route('/sessions/<string:token>/username/', methods=['GET'])
def get_username_from_token(token):
    username = SessionManager.get_username(token)
    return {"username": username}

@app.route('/messages/<int:message_id>', methods=['GET'])
def get_message(message_id):
    message = MessageManager.get_message_by_id(message_id)
    if not message:
        abort(404)
    return message.to_dict()


@app.route('/messages/', methods=['GET'])
def get_all_messages():
    response = []
    for message in MessageManager.get_all_messages():
        response.append(message.to_dict())
    return {"messages": response}


@app.route('/messages/', methods=['POST'])
def create_message():
    body = request.json
    message = MessageManager.create_message(body)
    return {"id": message.id}


@app.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    result = MessageManager.delete_message(message_id)
    if result:
        return Response(status=200)
    else:
        abort(500)


@app.route('/chats/<string:chat_id>', methods=['GET'])
def get_chat_api(chat_id):
    result = MessageManager.filter_messages_by_chat_id(chat_id)
    response = []
    for message in result:
        response.append(message.to_dict())
    return {"messages": response}


@app.route('/messages/last/', methods=['GET'])
def get_last_messages():
    num_messages = request.args.get('count', default=10)
    result = MessageManager.get_last_messages(num_messages)
    response = []
    for message in result:
        response.append(message.to_dict())
    return {"messages": response}

@app.route('/chats/<string:chat_id>/last/', methods=['GET'])
def get_last_messages_in_chat(chat_id):
    num_messages = request.args.get('count', default=50)
    result = MessageManager.get_last_messages_in_chat(chat_id, num_messages)
    response = []
    for message in result:
        response.append(message.to_dict())
    return {"messages": response}

@app.route('/chats/<string:chat_id>/updates/', methods=['GET'])
def get_message_updates_in_chat(chat_id):
    last_id = request.args.get('ref_id', default=None)
    if not last_id:
        result = []
    else:
        result = MessageManager.get_message_updates_in_chat(chat_id, last_id)
    response = []
    for message in result:
        response.append(message.to_dict())
    return {"messages": response}
        