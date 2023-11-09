package tiberius;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

public class Server {
    public static void main(String[] args) throws IOException {
        System.out.print("Adjon meg egy Ninckname-t: ");
        String Nickname= new BufferedReader(new InputStreamReader(System.in)).readLine();
        ServerSocket Server = new ServerSocket(55555);
        Socket Client = Server.accept();
        System.out.println(Client);
        class recive extends Thread{
            @Override
            public void run(){
                while (true){
                    try {
                        String text = new BufferedReader( new InputStreamReader(Client.getInputStream())).readLine();
                        if(text!=""){
                            System.out.println(text);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        class send extends Thread{
            @Override
            public void run() {
                while (true){
                    try {
                        String text = new BufferedReader(new InputStreamReader(System.in)).readLine();
                        if(text!=""){
                            PrintWriter out = new PrintWriter(new OutputStreamWriter(Client.getOutputStream()), true);
                            out.println("<"+Nickname+">: "+text);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
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