database = None


class MessageDatabase():
    def __init__(self):
        self.messages = []

        try:
            with open('messages.txt', mode='r') as file:
                self.messages = [message.rstrip().replace('\\n', '\n') for message in file.readlines()]
        except FileNotFoundError:
            pass

    def add_message(self, message):
        text = message['text']

        self.messages.append(text)
        with open('messages.txt', mode='a') as file:
            text = text.replace('\n', '\\n')
            file.write(f'{text}\n')


def get_connection():
    global database
    if not database:
        database = MessageDatabase()

    return database
