from enum import Enum, auto

class MessageBoxMode(Enum):
    OK = 0
    OK_CANCEL = 1
    YES_NO = 2
    YES_NO_CANCEL = 3
    RETRY_CANCEL = 4
    ABORT_RETRY_IGNORE = 5
    CLOSE = 6
