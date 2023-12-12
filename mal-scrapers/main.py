import sys
from PyQt5.QtWidgets import QApplication
from Screens.action_select_screen import SelectScreen

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = SelectScreen()
    window.show()
    sys.exit(app.exec_())
