package tiberius;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket Server = new ServerSocket(55555);
        System.out.print("Adjon meg egy Ninckname-t: ");
        String Nickname = new BufferedReader(new InputStreamReader(System.in)).readLine();
        Socket Client = Server.accept();
        PrintWriter guest = new PrintWriter(new OutputStreamWriter(Client.getOutputStream()), true);
        guest.println(Nickname);
        String Guestname = null;
        while (true) {
            String in = new BufferedReader(new InputStreamReader(Client.getInputStream())).readLine();
            if (in != "") {
                Guestname = in;
                break;
            }
        }
        System.out.println(Guestname + " has connected!");
        String finalGuestname = Guestname;
        class recive extends Thread {

            @Override
            public void run() {
                while (true) {
                    try {
                        String text = new BufferedReader(new InputStreamReader(Client.getInputStream())).readLine();
                        if (text != "") {
                            System.out.println(text);
                        }
                    } catch (IOException e) {
                        System.out.println(finalGuestname + " has left!");
                        System.exit(0);
                    }
                }
            }
        }
        class send extends Thread {
            @Override
            public void run() {
                while (true) {
                    try {
                        String text = new BufferedReader(new InputStreamReader(System.in)).readLine();
                        if (text != "") {
                            PrintWriter out = new PrintWriter(new OutputStreamWriter(Client.getOutputStream()), true);
                            out.println("<" + Nickname + ">: " + text);
                        }
                    } catch (IOException e) {
                        System.out.println(finalGuestname + " has left!");
                        System.exit(0);
                    }
                }
            }
        }
            recive t1 = new recive();
            send t2 = new send();
        t1.start();
        t2.start();
    }
}