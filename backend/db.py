import psycopg2
from flask import Blueprint, request, jsonify, abort, current_app

def get_db_connection():
    conn = psycopg2.connect(current_app.config['DATABASE_URI'])
    return conn

# import psycopg2
# from config import Config

# def get_db_connection():
#     conn = psycopg2.connect(Config.DATABASE_URL)
#     return conn