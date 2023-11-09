package tiberius;

import java.io.*;
import java.net.Socket;

public class Client {
    public static void main(String[] args) throws IOException{
        Socket Server = new Socket("127.0.0.1", 55555);
        System.out.print("Adjon meg egy Ninckname-t: ");
        String Nickname= new BufferedReader(new InputStreamReader(System.in)).readLine();
        PrintWriter guest = new PrintWriter(new OutputStreamWriter(Server.getOutputStream()), true);
        guest.println(Nickname);
        String servername= null;
        while (true) {
            String in = new BufferedReader( new InputStreamReader(Server.getInputStream())).readLine();
            if(in!=""){
                servername=in;
                break;
            }
        }
        System.out.println("Successfully connected!");
        class recive extends Thread{
            @Override
            public void run(){
                while (true){
                    try {
                        String text = new BufferedReader( new InputStreamReader(Server.getInputStream())).readLine();
                        if(text!=""){
                            System.out.println(text);
                        }
                    } catch (IOException e) {
                        System.out.println("Lecsatlakoztatva a szerverről");
                        break;
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
                            PrintWriter out = new PrintWriter(new OutputStreamWriter(Server.getOutputStream()), true);
                            out.println("<"+Nickname+">: "+text);
                        }
                    } catch (IOException e) {
                        System.out.println("Lecsatlakoztatva a szerverről");
                        break;
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